use anchor_lang::{prelude::*, solana_program::native_token::lamports_to_sol};

use crate::{
    context::{transfer_sol, withdraw_sol}, error::ProgramError, id, state::{appeal::Appeal, event::Event, option::EventOption, participation::Participation}
};

// --------------------------- Context ----------------------------- //

#[derive(Accounts)]
#[instruction(
    event_id: u128,
    option_ix: u8
)]
pub struct Vote<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"option".as_ref(), &event_id.to_le_bytes(), &[option_ix]],
        bump,
    )]
    pub option: Account<'info, EventOption>,

    #[account(
        init,
        payer = sender,
        owner = id(),
        seeds = [b"participation".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
        bump,
        space = Participation::LEN
    )]
    pub participation: Account<'info, Participation>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    event_id: u128,
)]
pub struct ClaimEventReward<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        seeds = [b"option".as_ref(), &event_id.to_le_bytes(), &[participation.option]],
        bump,
    )]
    pub option: Account<'info, EventOption>,

    #[account(
        mut,
        seeds = [b"participation".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
        constraint = participation.payer == sender.key() @ ProgramError::AuthorityMismatch,
        bump,
    )]
    pub participation: Account<'info, Participation>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    event_id: u128,
)]
pub struct Recharge<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        constraint = event.end_date < Clock::get()?.unix_timestamp @ ProgramError::ActiveEvent,
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"participant".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
        constraint = participant.payer == sender.key() @ ProgramError::AuthorityMismatch,
        bump,
    )]
    pub participant: Account<'info, Participation>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    event_id: u128,
)]
pub struct AppealResult<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init_if_needed,
        payer = sender,
        owner = id(),
        seeds = [b"appeal".as_ref(), &event_id.to_le_bytes()],
        bump,
        space = Appeal::LEN
    )]
    pub appeal: Account<'info, Appeal>,

    #[account(
        mut,
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        constraint = event.end_date < Clock::get()?.unix_timestamp @ ProgramError::ActiveEvent,
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        seeds = [b"participant".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
        constraint = participant.payer == sender.key() @ ProgramError::AuthorityMismatch,
        bump,
    )]
    pub participant: Account<'info, Participation>,

    pub system_program: Program<'info, System>,
}


// ------------------------ Implementation ------------------------- //

impl<'info> Vote<'info> {
    pub fn vote(&mut self, event_id: u128, option_ix: u8, amount: u64) -> Result<()> {
        let event = &self.event;
        let now = Clock::get()?.unix_timestamp;

        require!(
            (event.start_date..=event.end_date).contains(&now),
            ProgramError::InactiveEvent
        );

        if let Some(deadline) = event.participation_deadline {
            require!(deadline > now, ProgramError::ParticipationDeadlinePassed);
        }

        require!(!event.canceled, ProgramError::CanceledEvent);


        let participation = &mut self.participation;

        participation.event_id = event_id;
        participation.payer = self.sender.key();
        participation.option = option_ix;
        participation.deposited_amount = amount;
        participation.version = Participation::VERSION;

        transfer_sol(
            self.sender.to_account_info(),
            self.event.to_account_info(),
            amount,
            self.system_program.to_account_info(),
        )?;

        msg!(
            "New participation: user {} deposited {} SOL to {} event",
            participation.payer,
            lamports_to_sol(amount),
            uuid::Uuid::from_u128(participation.event_id)
        );

        Ok(())
    }
}

impl<'info> ClaimEventReward<'info> {
    pub fn claim_event_reward(&mut self, event_id: u128) -> Result<()> {
        
        require!(
            self.event.result.is_some(),
            ProgramError::EventIsNotOver
        );

        let res = self.event.result.unwrap();

        require!(
            res == self.participation.option,
            ProgramError::LosingOption
        );

        // TODO: calculate amount
        let amount = 123;

        withdraw_sol(
            &self.event.to_account_info(),
            &self.sender.to_account_info(),
            amount
        )?;

        self.participation.is_claimed = true;

        // LAMPORTS_PER_SOL - because DEFAULT_MINT_DECIMALS = SOL DECIMALS
        msg!(
            "User {} claimed {} SOL from {} event",
            self.participation.payer,
            lamports_to_sol(amount),
            uuid::Uuid::from_u128(event_id)
        );

        Ok(())
    }
}

impl<'info> Recharge<'info> {
    pub fn racharge(&mut self, event_id: u128) -> Result<()> {
        require!(
            self.event.canceled,
            ProgramError::EventIsNotCancelled
        );

        withdraw_sol(
            &self.event.to_account_info(),
            &self.sender.to_account_info(),
            self.participant.deposited_amount,
        )?;

        self.participant.is_claimed = true;

        msg!(
            "New recharge: user {} recharged {} SOL from {} event",
            self.participant.payer,
            lamports_to_sol(self.participant.deposited_amount),
            uuid::Uuid::from_u128(event_id)
        );

        Ok(())
    }
}

impl<'info> AppealResult<'info> {
    pub fn appeal(&mut self, _event_id: u128) -> Result<()> {
        require!(
            self.event.result.is_some(),
            ProgramError::EventIsNotOver
        );

        // TODO: add logic

        Ok(())
    }
}