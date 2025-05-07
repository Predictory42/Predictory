use super::DISCRIMINATOR_LENGTH;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Appeal {
    /// Participant round version, default to 1
    pub version: u8,

    /// Event UUID
    pub event_id: u128,
}

impl Appeal {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + Appeal::INIT_SPACE;
    pub const VERSION: u8 = 1;
}
