use anchor_lang::prelude::*;

#[error_code]
pub enum ProgramError {
    #[msg("Authority mismatched")]
    AuthorityMismatch,
    #[msg("Account has illegal owner")]
    IllegalOwner,
    #[msg("Event has already started")]
    EventAlreadyStarted,
    #[msg("Invalid UUID version")]
    InvalidUUID,
    #[msg("Invalid sale end date")]
    InvalidEndDate,
}
