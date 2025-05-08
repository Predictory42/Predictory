use anchor_lang::prelude::*;

use crate::{
    context::{transfer_sol, withdraw_sol},
    error::ProgramError,
    id,
    state::user::User,
};

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

#[derive(Accounts)]
pub struct TransferStake<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawStake<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

// ------------------------ Implementation ------------------------- //

impl<'info> CreateUser<'info> {
    pub fn create_user(&mut self, name: [u8; 32]) -> Result<()> {
        let user = &mut self.user;

        // TODO: PRICE TRUST/SOL
        // TODO: Add trust coins to play (eq 0,1 sol) !!!!

        user.name = name;
        user.payer = self.sender.key();
        user.version = User::VERSION;

        msg!("New user created {}", user.payer,);

        Ok(())
    }
}

impl<'info> TransferStake<'info> {
    pub fn transfer_stake(&mut self, stake: u64) -> Result<()> {
        transfer_sol(
            self.sender.to_account_info(),
            self.user.to_account_info(),
            stake,
            self.system_program.to_account_info(),
        )?;

        let user = &mut self.user;

        user.stake += stake;

        msg!("New user created {}", user.payer,);

        Ok(())
    }
}

impl<'info> WithdrawStake<'info> {
    pub fn withdraw(&mut self, event_id: u128) -> Result<()> {
        let user = &self.user;
        require!(user.stake < user.locked_stake, ProgramError::AllStakeLocked);

        let amount = user.stake - user.locked_stake;

        withdraw_sol(
            &self.user.to_account_info(),
            &self.sender.to_account_info(),
            amount,
        )?;

        msg!(
            "User stake withdrawn - {}: {}",
            self.user.payer,
            uuid::Uuid::from_u128(event_id)
        );

        Ok(())
    }
}
