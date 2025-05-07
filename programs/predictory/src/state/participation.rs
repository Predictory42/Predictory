use super::DISCRIMINATOR_LENGTH;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Participation {
    /// Participant round version, default to 1
    pub version: u8,

    /// Event UUID
    pub event_id: u128,

    /// User wallet account
    pub payer: Pubkey,

    /// Chosen event option index
    pub option: u8,

    /// How much the user has deposited
    pub deposited_amount: u64,

    /// Whether the user has claimed tokens or recharged SOL
    pub is_claimed: bool,
}

impl Participation {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + Participation::INIT_SPACE;
    pub const VERSION: u8 = 1;
}
