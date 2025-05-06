use anchor_lang::prelude::*;

use crate::{
    context::MAX_OPTION_COUNT,
    error::ProgramError,
    id,
    state::{event::Event, option::EventOption},
};
// --------------------------- Context ----------------------------- //

#[derive(Accounts)]
#[instruction(
    event_id: u128,
    index: u8,
)]
pub struct CreateEventOption<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        owner = id(),
        seeds = [b"option".as_ref(), &event_id.to_le_bytes(), &[index]],
        bump,
        space = EventOption::LEN
    )]
    pub option: Account<'info, EventOption>,

    #[account(
        mut,
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        constraint = event.authority == authority.key() @ ProgramError::AuthorityMismatch,
        constraint = event.start_date > Clock::get()?.unix_timestamp @ ProgramError::EventAlreadyStarted,
        bump,
    )]
    pub event: Account<'info, Event>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    event_id: u128,
    index: u8
)]
pub struct UpdateEventOption<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [b"event".as_ref(), &event_id.to_le_bytes()],
        constraint = event.authority == authority.key() @ ProgramError::AuthorityMismatch,
        constraint = event.start_date > Clock::get()?.unix_timestamp @ ProgramError::EventAlreadyStarted,
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"option".as_ref(), &event_id.to_le_bytes(), &[index]],
        bump,
    )]
    pub option: Account<'info, EventOption>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> CreateEventOption<'info> {
    pub fn create_event_option(
        &mut self,
        index: u8,
        event_id: u128,
        description: [u8; 256],
    ) -> Result<()> {
        let option = &mut self.option;
        let event = &mut self.event;

        require!(index == event.option_count, ProgramError::InvalidIndex);
        require!(
            event.option_count < MAX_OPTION_COUNT,
            ProgramError::TooManyOptions
        );

        option.event_id = event_id;
        option.description = description;

        event.option_count += 1;

        msg!(
            "{} option added to event {}",
            index,
            uuid::Uuid::from_u128(event_id)
        );

        Ok(())
    }
}

impl<'info> UpdateEventOption<'info> {
    pub fn update_event_option(
        &mut self,
        index: u8,
        event_id: u128,
        description: [u8; 256],
    ) -> Result<()> {
        let option = &mut self.option;

        option.description = description;

        msg!(
            "{} option updated in event {}",
            index,
            uuid::Uuid::from_u128(event_id)
        );

        Ok(())
    }
}
