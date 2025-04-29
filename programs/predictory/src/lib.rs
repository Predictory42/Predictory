use anchor_lang::prelude::*;
use context::*;

mod context;
mod error;
mod state;

declare_id!("CEYFY2CbDJ3TywKT3tzef6BcqE4NoviFTjhpURTK714U");

#[program]
pub mod predictory {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        event_id: u128,
        args: CreateEventArgs,
    ) -> Result<()> {
        ctx.accounts.create_event(event_id, args)
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
        index: u8,
        event_id: u128,
        description: [u8; 256],
    ) -> Result<()> {
        ctx.accounts
            .create_event_option(index, event_id, description)
    }

    pub fn update_event_option(
        ctx: Context<UpdateEventOption>,
        index: u8,
        event_id: u128,
        description: [u8; 256],
    ) -> Result<()> {
        ctx.accounts
            .update_event_option(index, event_id, description)
    }
}
