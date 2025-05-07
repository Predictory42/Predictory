use anchor_lang::prelude::*;
use context::*;

mod context;
mod error;
mod state;

declare_id!("CEYFY2CbDJ3TywKT3tzef6BcqE4NoviFTjhpURTK714U");

#[program]
pub mod predictory {
    use super::*;

    // TODO:
    // 1. Add state
    // 3. Participation

    pub fn create_user(ctx: Context<CreateUser>, name: [u8; 32]) -> Result<()> {
        ctx.accounts.create_user(name)
    }

    pub fn create_event(
        ctx: Context<CreateEvent>,
        event_id: u128,
        stake: u64,
        args: CreateEventArgs,
    ) -> Result<()> {
        ctx.accounts.create_event(event_id, stake, args)
    }

    pub fn update_event_name(
        ctx: Context<UpdateEvent>,
        event_id: u128,
        name: [u8; 32],
    ) -> Result<()> {
        ctx.accounts.update_event_name(event_id, name)
    }

    pub fn update_event_description(
        ctx: Context<UpdateEvent>,
        event_id: u128,
        description: [u8; 256],
    ) -> Result<()> {
        ctx.accounts.update_event_description(event_id, description)
    }

    pub fn update_event_end_date(
        ctx: Context<UpdateEvent>,
        event_id: u128,
        end_date: i64,
    ) -> Result<()> {
        ctx.accounts.update_event_end_date(event_id, end_date)
    }

    pub fn update_event_participation_deadline(
        ctx: Context<UpdateEvent>,
        event_id: u128,
        deadline: Option<i64>,
    ) -> Result<()> {
        ctx.accounts
            .update_event_participation_deadline(event_id, deadline)
    }

    pub fn create_event_option(
        ctx: Context<CreateEventOption>,
        event_id: u128,
        index: u8,
        description: [u8; 256],
    ) -> Result<()> {
        ctx.accounts
            .create_event_option(event_id, index, description)
    }

    pub fn update_event_option(
        ctx: Context<UpdateEventOption>,
        event_id: u128,
        index: u8,
        description: [u8; 256],
    ) -> Result<()> {
        ctx.accounts
            .update_event_option(event_id, index, description)
    }

    pub fn cancel_event(ctx: Context<CancelEvent>, event_id: u128) -> Result<()> {
        ctx.accounts.cancel_event(event_id)
    }

    pub fn complete_event(ctx: Context<CompleteEvent>, event_id: u128, result: u8) -> Result<()> {
        ctx.accounts.complete_event(event_id, result)
    }

    pub fn withdraw_stake(ctx: Context<WithdrawStake>, event_id: u128) -> Result<()> {
        ctx.accounts.withdraw(event_id)
    }

    pub fn vote(ctx: Context<Vote>, event_id: u128, option_ix: u8, amount: u64) -> Result<()> {
        ctx.accounts.vote(event_id, option_ix, amount)
    }
}
