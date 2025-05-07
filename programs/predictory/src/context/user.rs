use anchor_lang::prelude::*;

use crate::{id, state::user::User};

// --------------------------- Context ----------------------------- //

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init,
        payer = sender,
        owner = id(),
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
        space = User::LEN
    )]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> CreateUser<'info> {
    pub fn create_user(&mut self, name: [u8; 32]) -> Result<()> {
        let user = &mut self.user;

        user.name = name;
        user.payer = self.sender.key();
        user.version = User::VERSION;

        msg!("New user created {}", user.payer,);

        Ok(())
    }
}
