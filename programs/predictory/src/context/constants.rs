pub const UUID_VERSION: usize = 4;

#[cfg(feature = "testing")]
pub const COMPLETION_DEADLINE: i64 = 0; // Only for testing
#[cfg(not(feature = "testing"))]
pub const COMPLETION_DEADLINE: i64 = 60 * 60 * 24; // 1 day

#[cfg(feature = "testing")]
pub const APPELLATION_DEADLINE: i64 = 1; // Only for testing
#[cfg(not(feature = "testing"))]
pub const APPELLATION_DEADLINE: i64 = 60 * 60 * 24; // 1 days

pub const MAX_OPTION_COUNT: u8 = 20;
pub const INITIAL_LVL: u64 = 5;
