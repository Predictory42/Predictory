use super::DISCRIMINATOR_LENGTH;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Event {
    /// Account version
    pub version: u8,

    /// Event UUID
    pub id: u128,

    /// Event authority
    pub authority: Pubkey,

    /// Sale start date
    pub start_date: i64,

    /// Sale end date
    pub end_date: i64,

    /// Sale participation deadline
    pub participation_deadline: Option<i64>,

    /// Whether the sale is unlocked
    pub completed: bool,
}

impl Event {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + Event::INIT_SPACE;
    pub const VERSION: u8 = 1;
}

#[account]
#[derive(InitSpace)]
pub struct EventMeta {
    /// Account version
    pub version: u8,

    /// Sale UUID
    pub id: u128,

    /// Sale name
    pub name: [u8; 32],

    // TODO: add image link
    /// Sale description
    pub description: [u8; 256],

    /// Deposit statistics
    pub stats: [u64; 5],
}

impl EventMeta {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + EventMeta::INIT_SPACE;
    pub const VERSION: u8 = 1;
}
