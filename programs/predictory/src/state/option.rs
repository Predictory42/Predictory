use super::DISCRIMINATOR_LENGTH;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct EventOption {
    /// Account version
    pub version: u8,

    /// Option index
    pub index: u8,

    /// Event UUID
    pub event_id: u128,

    /// Option description
    pub description: [u8; 256],

    /// Option votes
    pub votes: u64,

    /// Option vault balance
    pub vault_balance: u64,
}

impl EventOption {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + EventOption::INIT_SPACE;
    pub const VERSION: u8 = 1;
}
