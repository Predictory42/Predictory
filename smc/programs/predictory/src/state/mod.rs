pub(crate) mod appeal;
pub(crate) mod contract_state;
pub(crate) mod event;
pub(crate) mod option;
pub(crate) mod participation;
pub(crate) mod user;

/// Anchor discriminator length
pub const DISCRIMINATOR_LENGTH: usize = 8;
/// Account reserve space
pub const ACCOUNT_RESERVE_SPACE: usize = 32;
