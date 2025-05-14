use anchor_lang::{
    prelude::*,
    solana_program::native_token::{lamports_to_sol, LAMPORTS_PER_SOL},
};

use crate::{
    context::{withdraw_sol, APPELLATION_DEADLINE, COMPLETION_DEADLINE},
    error::ProgramError,
    id,
    state::{
        appeal::Appellation, contract_state::State, event::Event, option::EventOption,
        participation::Participation, user::User,
    },
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
        mut,
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
    // TODO: check this
        // constraint = event.authority != sender.key() @ ProgramError::CreatorParticipation,
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

    /// CHECK: this is admin account
    #[account(mut)]
    pub contract_admin: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), event.authority.key().as_ref()],
        bump,
    )]
    pub event_admin: Account<'info, User>,

    #[account(
        seeds = [b"state".as_ref()],
        constraint = state.authority == contract_admin.key() @ ProgramError::AuthorityMismatch,
        bump,
    )]
    pub state: Account<'info, State>,

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
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [b"participation".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
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

    /// CHECK: this is admin account
    #[account(mut)]
    pub contract_admin: UncheckedAccount<'info>,

    #[account(
            seeds = [b"state".as_ref()],
            constraint = state.authority == contract_admin.key() @ ProgramError::AuthorityMismatch,
            bump,
        )]
    pub state: Account<'info, State>,

    #[account(
        init_if_needed,
        payer = sender,
        owner = id(),
        seeds = [b"appeal".as_ref(), &event_id.to_le_bytes()],
        bump,
        space = Appellation::LEN
    )]
    pub appellation: Account<'info, Appellation>,

    #[account(
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        constraint = event.end_date < Clock::get()?.unix_timestamp @ ProgramError::ActiveEvent,
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        seeds = [b"option".as_ref(), &event_id.to_le_bytes(), &[participation.option]],
        bump,
    )]
    pub option: Account<'info, EventOption>,

    #[account(
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,

    #[account(
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
pub struct BurnTrust<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
            seeds = [b"state".as_ref()],
            bump,
        )]
    pub state: Account<'info, State>,

    #[account(
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,

    #[account(
        seeds = [b"participation".as_ref(), &event_id.to_le_bytes(), sender.key().as_ref()],
        constraint = participation.payer == sender.key() @ ProgramError::AuthorityMismatch,
        bump,
    )]
    pub participation: Account<'info, Participation>,

    pub system_program: Program<'info, System>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> Vote<'info> {
    pub fn vote(&mut self, event_id: u128, option_ix: u8, amount: u64) -> Result<()> {
        let event = &mut self.event;
        let option = &mut self.option;
        let user = &mut self.user;

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

        event.participation_count += 1;
        event.total_trust += user.trust_lvl;
        event.total_amount += amount;

        option.vault_balance += amount;
        option.votes += 1;

        user.stake -= amount;

        withdraw_sol(
            &self.user.to_account_info(),
            &self.event.to_account_info(),
            amount,
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
        let user = &mut self.user;
        let event = &mut self.event;

        require!(event.result.is_some(), ProgramError::EventIsNotOver);
        require!(!self.participation.is_claimed, ProgramError::AlreadyClaimed);
        require!(!self.participation.appealed, ProgramError::AlreadyAppealed);

        let now = Clock::get()?.unix_timestamp;

        require!(
            now > event.end_date + COMPLETION_DEADLINE + APPELLATION_DEADLINE,
            ProgramError::EarlyClaim
        );

        // TODO: check this
        // let org_reward = event.total_amount * self.state.org_reward / 100;
        // let available_for_winners =
        // event.total_amount * (1 - self.state.platform_fee - self.state.org_reward);

        let org_reward = (event.total_amount as f64 * self.state.org_reward as f64 / 100.0) as u64;

        let available_for_winners = if event.total_amount < self.state.platform_fee + org_reward {
            event.total_amount
        } else {
            event.total_amount - self.state.platform_fee - org_reward
        };

        // Releasing creator stake
        if event.stake != 0 {
            let mut amount = event.stake;

            if available_for_winners != event.total_amount {
                amount += org_reward;

                withdraw_sol(
                    &event.to_account_info(),
                    &self.contract_admin.to_account_info(),
                    self.state.platform_fee,
                )?;
            }

            self.event_admin.locked_stake -= event.stake;
            self.event_admin.stake += amount;

            withdraw_sol(
                &event.to_account_info(),
                &self.event_admin.to_account_info(),
                amount,
            )?;

            event.stake = 0;
        }

        if event.result.unwrap() == self.participation.option {
            let claim_amount = self.participation.deposited_amount / self.option.vault_balance
                * available_for_winners;

            user.stake += claim_amount;

            withdraw_sol(
                &self.event.to_account_info(),
                &user.to_account_info(),
                claim_amount,
            )?;

            // TODO: check this
            let trust_reward =
                (claim_amount as f64 / LAMPORTS_PER_SOL as f64) * self.state.multiplier as f64;
            user.trust_lvl += trust_reward as u64;
        } else {
            let trust_reward = (self.participation.deposited_amount as f64
                / LAMPORTS_PER_SOL as f64)
                * self.state.multiplier as f64;
            user.trust_lvl += trust_reward as u64;
        }

        self.participation.is_claimed = true;

        msg!(
            "User {} claimed {} event",
            self.participation.payer,
            uuid::Uuid::from_u128(event_id)
        );

        Ok(())
    }
}

impl<'info> Recharge<'info> {
    pub fn recharge(&mut self, event_id: u128) -> Result<()> {
        require!(self.event.canceled, ProgramError::EventIsNotCancelled);

        let user = &mut self.user;

        user.stake += self.participant.deposited_amount;

        withdraw_sol(
            &self.event.to_account_info(),
            &self.user.to_account_info(),
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
        require!(self.event.result.is_some(), ProgramError::EventIsNotOver);
        require!(!self.participation.is_claimed, ProgramError::AlreadyClaimed);
        require!(!self.participation.appealed, ProgramError::AlreadyAppealed);

        let now = Clock::get()?.unix_timestamp;
        let appellation = &mut self.appellation;
        let participation = &mut self.participation;
        let event = &self.event;

        require!(
            now <= event.end_date + COMPLETION_DEADLINE + APPELLATION_DEADLINE,
            ProgramError::AppellationDeadlinePassed
        );

        appellation.disagree_count += 1;
        appellation.disagree_trust_lvl += self.user.trust_lvl;
        appellation.disagree_volume += participation.deposited_amount;
        participation.appealed = true;

        let disagree_ratio = appellation.disagree_count as f64 / event.participation_count as f64;
        let trust_ratio = appellation.disagree_trust_lvl as f64 / event.total_trust as f64;
        let volume_ratio = appellation.disagree_volume as f64
            / (event.total_amount - self.option.vault_balance) as f64;

        // Closing event
        if disagree_ratio < trust_ratio * volume_ratio {
            self.user.locked_stake -= event.stake;
            self.user.stake -= event.stake;

            withdraw_sol(
                &event.to_account_info(),
                &self.contract_admin.to_account_info(),
                event.stake,
            )?;
        }

        Ok(())
    }
}

impl<'info> BurnTrust<'info> {
    pub fn burn_trust(&mut self, _event_id: u128) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let event = &self.event;
        let user = &mut self.user;
        let participation = &mut self.participation;

        require!(
            (event.start_date..=event.end_date).contains(&now),
            ProgramError::InactiveEvent
        );

        require!(
            now <= event.end_date + COMPLETION_DEADLINE + APPELLATION_DEADLINE,
            ProgramError::AppellationDeadlinePassed
        );

        // TODO: check this
        let available_amount = (user.trust_lvl / self.state.multiplier) * LAMPORTS_PER_SOL;
        let amount_to_claim = if available_amount >= participation.deposited_amount {
            participation.deposited_amount
        } else {
            participation.deposited_amount - available_amount
        };
        let burned_trust = amount_to_claim / LAMPORTS_PER_SOL * self.state.multiplier;

        user.stake += amount_to_claim;
        user.locked_stake -= amount_to_claim;
        user.trust_lvl -= burned_trust;
        participation.deposited_amount -= amount_to_claim;

        withdraw_sol(
            &self.event.to_account_info(),
            &self.user.to_account_info(),
            amount_to_claim,
        )?;

        Ok(())
    }
}
