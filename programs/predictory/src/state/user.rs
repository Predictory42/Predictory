use super::DISCRIMINATOR_LENGTH;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct User {
    /// User round version, default to 1
    pub version: u8,

    /// User wallet account
    pub payer: Pubkey,

    /// User stake
    pub stake: u64,

    /// User locked stake sales
    pub locked_stake: u64,

    // TODO: add trust lvl
    /// User name
    pub name: [u8; 32],
}

impl User {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + User::INIT_SPACE;
    pub const VERSION: u8 = 1;
}
