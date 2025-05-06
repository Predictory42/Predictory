use anchor_lang::prelude::*;

#[error_code]
pub enum ProgramError {
    #[msg("Authority mismatched")]
    AuthorityMismatch,
    #[msg("Account has illegal owner")]
    IllegalOwner,
    #[msg("Event has already started")]
    EventAlreadyStarted,
    #[msg("Event is not over")]
    EventIsNotOver,
    #[msg("Invalid UUID version")]
    InvalidUUID,
    #[msg("Invalid sale end date")]
    InvalidEndDate,
    #[msg("Invalid index - must be sequential")]
    InvalidIndex,
    #[msg("Event has too many options")]
    TooManyOptions,
    #[msg("Event is inactive")]
    InactiveEvent,
    #[msg("Event is still active")]
    ActiveEvent,
    #[msg("Stake can be withdrawn only after the event is over and appellation time has passed")]
    EarlyStakeWithdraw,
}
