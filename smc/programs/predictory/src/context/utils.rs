use anchor_lang::{prelude::*, system_program};

/// This method transfers sol from user to program account
pub fn transfer_sol<'info>(
    from: AccountInfo<'info>,
    to: AccountInfo<'info>,
    amount: u64,
    system_program: AccountInfo<'info>,
) -> Result<()> {
    let cpi_ctx = CpiContext::new(system_program, system_program::Transfer { from, to });

    system_program::transfer(cpi_ctx, amount)
}

/// This method transfers sol from program account to user account
pub fn withdraw_sol<'info>(
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    from.sub_lamports(amount)?;
    to.add_lamports(amount)?;

    Ok(())
}
