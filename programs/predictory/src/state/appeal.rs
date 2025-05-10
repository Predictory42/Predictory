use super::DISCRIMINATOR_LENGTH;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Appellation {
    /// Participant round version, default to 1
    pub version: u8,

    /// Event UUID
    pub event_id: u128,

    /// Participant appellation count
    pub disagree_count: u64,

    /// Participant appellation count
    pub disagree_trust_lvl: u64,

    /// Participant deposit volume
    pub disagree_volume: u64,
}

impl Appellation {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + Appellation::INIT_SPACE;
    pub const VERSION: u8 = 1;
}
