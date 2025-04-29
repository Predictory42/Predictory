use anchor_lang::prelude::*;
use context::*;

mod context;
mod error;
mod state;

declare_id!("CEYFY2CbDJ3TywKT3tzef6BcqE4NoviFTjhpURTK714U");

#[program]
pub mod predictory {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
