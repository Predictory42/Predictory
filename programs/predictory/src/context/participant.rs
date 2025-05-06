use anchor_lang::{prelude::*, solana_program::native_token::lamports_to_sol};

use crate::{
    error::ProgramError,
    id,
    state::{event::Event, option::EventOption, participant::Participant},
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
        seeds = [b"option".as_ref(), &event_id.to_le_bytes(), &[option_ix]],
        bump,
    )]
    pub option: Account<'info, EventOption>,

    #[account(
        init,
        payer = sender,
        owner = id(),
        seeds = [b"participant".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
        bump,
        space = Participant::LEN
    )]
    pub participant: Account<'info, Participant>,

    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// #[instruction(
//     event_id: u128,
// )]
// pub struct ClaimEventReward<'info> {
//     #[account(mut)]
//     pub sender: Signer<'info>,

//     #[account(
//         mut,
//         seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
//         bump,
//     )]
//     pub event: Account<'info, Event>,

//     #[account(
//         mut,
//         seeds = [b"participant".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
//         constraint = participant.payer == sender.key() @ ProgramError::AuthorityMismatch,
//         bump,
//     )]
//     pub participant: Account<'info, Participant>,

//     #[account(
//         seeds = [b"event_mint".as_ref(), &event_id.to_le_bytes()],
//         bump,
//         constraint = mint.key() == event.mint @ ProgramError::InvalidMint,
//     )]
//     pub mint: InterfaceAccount<'info, Mint>,

//     #[account(
//         init_if_needed,
//         payer = sender,
//         associated_token::mint = mint,
//         associated_token::authority = sender,
//         associated_token::token_program = token_program,
//     )]
//     pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,

//     #[account(
//         mut,
//         associated_token::mint = mint,
//         associated_token::authority = mint,
//     )]
//     pub mint_token_account: InterfaceAccount<'info, TokenAccount>,

//     pub token_program: Program<'info, Token>,

//     pub associated_token_program: Program<'info, AssociatedToken>,

//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// #[instruction(
//     event_id: u128,
// )]
// pub struct Recharge<'info> {
//     #[account(mut)]
//     pub sender: Signer<'info>,

//     #[account(
//         mut,
//         seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
//         constraint = event.end_date < Clock::get()?.unix_timestamp @ ProgramError::ActiveEvent,
//         bump,
//     )]
//     pub event: Account<'info, Event>,

//     #[account(
//         mut,
//         seeds = [b"participant".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
//         constraint = participant.payer == sender.key() @ ProgramError::AuthorityMismatch,
//         bump,
//     )]
//     pub participant: Account<'info, Participant>,

//     pub system_program: Program<'info, System>,
// }

// ------------------------ Implementation ------------------------- //

impl<'info> Vote<'info> {
    pub fn vote(&mut self, event_id: u128, option_ix: u8, amount: u64) -> Result<()> {
        let event = &self.event;
        let now = Clock::get()?.unix_timestamp;

        require!(
            (event.start_date..=event.end_date).contains(&now),
            ProgramError::InactiveEvent
        );

        // require!(
        //     (MIN_AMOUNT..=MAX_AMOUNT).contains(&amount),
        //     ProgramError::InvalidParticipationAmount
        // );

        // let amount_to_claim = amount * (self.state.multiplier[multiplier] as u64);

        // let distribution_amount = self
        //     .event
        //     .distribution_amount
        //     .checked_add(amount_to_claim)
        //     .ok_or(ProgramError::ValueOverflow)?;

        // require!(
        //     distribution_amount <= COMPLETION_AMOUNT,
        //     ProgramError::DistributionAmountExceeded
        // );

        let participant = &mut self.participant;

        // participant.event_id = event_id;
        // participant.payer = self.sender.key();
        // participant.claim_hour = claim_hour;
        // participant.deposited_amount = amount;
        // participant.amount_to_claim = amount_to_claim;
        // participant.version = Participant::VERSION;

        // transfer_sol(
        //     self.sender.to_account_info(),
        //     self.event.to_account_info(),
        //     amount,
        //     self.system_program.to_account_info(),
        // )?;

        // self.event_meta.stats[multiplier] = self.event_meta.stats[multiplier]
        //     .checked_add(amount)
        //     .ok_or(ProgramError::ValueOverflow)?;

        // // if !self.event.is_locked {
        //     self.event.is_locked = true;
        // }

        // self.event.distribution_amount = distribution_amount;

        // self.event.deposited_amount = self
        //     .event
        //     .deposited_amount
        //     .checked_add(amount)
        //     .ok_or(ProgramError::ValueOverflow)?;

        msg!(
            "New participation: user {} deposited {} SOL to {} event",
            participant.payer,
            lamports_to_sol(amount),
            uuid::Uuid::from_u128(participant.event_id)
        );

        Ok(())
    }
}

// impl<'info> ClaimEventReward<'info> {
//     pub fn claim_event_reward(&mut self, event_id: u128, mint_bump: u8) -> Result<()> {
//         let claim_date =
//             self.event.end_date + (self.participant.claim_hour as i64) * SECONDS_PER_HOUR;

//         require!(
//             self.event.distribution_amount == COMPLETION_AMOUNT,
//             ProgramError::EventIsNotFilledEnough
//         );

//         require!(
//             claim_date <= Clock::get()?.unix_timestamp,
//             ProgramError::EarlyClaim
//         );

//         require!(
//             !self.participant.is_claimed,
//             ProgramError::ParticipantAlreadyClaimed
//         );

//         self.participant.is_claimed = true;

//         transfer_tokens(
//             self.mint.to_account_info(),
//             self.mint_token_account.to_account_info(),
//             self.recipient_token_account.to_account_info(),
//             self.token_program.to_account_info(),
//             event_id,
//             self.participant.amount_to_claim,
//             mint_bump,
//         )?;

//         // LAMPORTS_PER_SOL - because DEFAULT_MINT_DECIMALS = SOL DECIMALS
//         msg!(
//             "User {} claimed {} tokens from {} event",
//             self.participant.payer,
//             lamports_to_sol(self.participant.amount_to_claim),
//             uuid::Uuid::from_u128(event_id)
//         );

//         Ok(())
//     }
// }

// impl<'info> Recharge<'info> {
//     pub fn racharge(&mut self, event_id: u128) -> Result<()> {
//         require!(
//             !self.participant.is_claimed,
//             ProgramError::ParticipantAlreadyClaimed
//         );

//         require!(
//             self.event.distribution_amount < COMPLETION_AMOUNT,
//             ProgramError::FilledEvent
//         );

//         self.participant.is_claimed = true;

//         withdraw_sol(
//             &self.event.to_account_info(),
//             &self.sender.to_account_info(),
//             self.participant.deposited_amount,
//         )?;

//         msg!(
//             "New recharge: user {} recharged {} SOL from {} event",
//             self.participant.payer,
//             lamports_to_sol(self.participant.deposited_amount),
//             uuid::Uuid::from_u128(event_id)
//         );

//         Ok(())
//     }
// }
