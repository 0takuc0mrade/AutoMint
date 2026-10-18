# Registry Contract API Reference

The Registry contract is the source of truth for user identity on AutoMint: it stores usernames, cumulative points, claimed AMT, bot counts, and exposes a bounded leaderboard query.

## Public Functions

### initialize

```rust
pub fn initialize(env: Env, admin: Address) -> Result<(), RegistryError>
```

Initialize the registry with an admin address. Must be called once before any other function.

- `admin`: The registry administrator address. Must authorize the call.

Errors:
- `AlreadyInitialized`: The contract has already been initialized.

Example:

```rust
let admin = Address::generate(&env);
registry_client.initialize(&admin);
```

---

### register

```rust
pub fn register(env: Env, user: Address, username: String) -> Result<(), RegistryError>
```

Register a new user profile. Requires authorization from `user`.

- `user`: The address to register.
- `username`: Display name, 1-32 characters, and unique across the registry.

Errors:
- `AlreadyRegistered`: `user` already has a profile.
- `UsernameTaken`: `username` is empty, longer than 32 characters, or already used by another address.

Example:

```rust
registry_client.register(&user, &String::from_str(&env, "Alice"));
```

---

### is_registered

```rust
pub fn is_registered(env: Env, user: Address) -> bool
```

Check whether `user` has a registered profile. Never errors.

Example:

```rust
let registered = registry_client.is_registered(&user);
```

---

### get_user

```rust
pub fn get_user(env: Env, user: Address) -> Result<UserProfile, RegistryError>
```

Fetch the full `UserProfile` for `user`.

Errors:
- `NotRegistered`: `user` has no profile.

Example:

```rust
let profile = registry_client.get_user(&user);
```

---

### get_users_batch

```rust
pub fn get_users_batch(
    env: Env,
    addresses: Vec<Address>,
) -> Result<Vec<Option<UserProfile>>, RegistryError>
```

Fetch profiles for up to `MAX_USERS_BATCH` (50) addresses in a single simulation, returning one `Option<UserProfile>` per input address in the same order (`None` for unregistered addresses).

Errors:
- `BatchTooLarge`: `addresses.len() > MAX_USERS_BATCH` (50).

---

### add_points

```rust
pub fn add_points(env: Env, user: Address, points: u64) -> Result<(), RegistryError>
```

Add `points` to `user`'s `total_points`, saturating on overflow. Called by the Accrual contract when a user claims. `points == 0` is a no-op that returns `Ok(())`.

Errors:
- `NotRegistered`: `user` has no profile.

Example:

```rust
registry_client.add_points(&user, &200_u64);
```

---

### increment_bot_count

```rust
pub fn increment_bot_count(env: Env, user: Address) -> Result<(), RegistryError>
```

Increment `user`'s `bot_count` by 1, saturating at `u32::MAX`. Called by the Bot NFT contract after a successful mint.

Errors:
- `NotRegistered`: `user` has no profile.

Example:

```rust
registry_client.increment_bot_count(&user);
```

---

### decrement_bot_count

```rust
pub fn decrement_bot_count(env: Env, user: Address) -> Result<(), RegistryError>
```

Decrement `user`'s `bot_count` by 1, flooring at 0 via `saturating_sub`. Requires authorization from `user`.

Errors:
- `NotRegistered`: `user` has no profile.

Example:

```rust
registry_client.decrement_bot_count(&user);
```

---

### add_claimed_amt

```rust
pub fn add_claimed_amt(env: Env, user: Address, amount: i128) -> Result<(), RegistryError>
```

Add `amount` to `user`'s `claimed_amt` running total, saturating on overflow. `amount == 0` is a no-op that returns `Ok(())`; negative amounts are rejected with `RegistryError::NegativeAmount` so `claimed_amt` is monotonically non-decreasing.

Numeric type rationale: `total_points` is `u64` (an internal non-negative counter accrued from `u64` bot rates × `u64` seconds), whereas `claimed_amt` is `i128` because token balances and transfer/mint amounts are canonically `i128` across Soroban and SEP-41 (`soroban_sdk::token`).

Errors:
- `NegativeAmount`: `amount < 0`.
- `NotRegistered`: `user` has no profile.

Example:

```rust
registry_client.add_claimed_amt(&user, &2_i128);
```

---

### get_leaderboard

```rust
pub fn get_leaderboard(env: Env, limit: u32) -> Vec<UserProfile>
```

Return up to `min(limit, LEADERBOARD_SIZE)` (`LEADERBOARD_SIZE = 100`) `UserProfile` records sorted by `total_points` descending from the bounded top-N leaderboard. Ties are broken by who reached the total first. `limit == 0` returns an empty vector.

Example:

```rust
let top_10 = registry_client.get_leaderboard(&10_u32);
```

---

### get_rank

```rust
pub fn get_rank(env: Env, user: Address) -> Result<u32, RegistryError>
```

Return the 1-based leaderboard rank of `user` backed by the bounded top-N structure (`TopUsers`), or `u32::MAX` (`UNRANKED`, documented as "unranked") for registered users below the top-100 cutoff.

Errors:
- `NotRegistered`: `user` has no profile.

---

### total_users

```rust
pub fn total_users(env: Env) -> u32
```

Return the total number of registered users. Returns `0` if the registry has not been initialized yet.

Example:

```rust
let count = registry_client.total_users();
```

---

### get_admin / set_admin / accept_admin / cancel_admin_transfer / pending_admin

```rust
pub fn get_admin(env: Env) -> Result<Address, RegistryError>
pub fn set_admin(env: Env, new_admin: Address) -> Result<(), RegistryError>
pub fn accept_admin(env: Env) -> Result<(), RegistryError>
pub fn cancel_admin_transfer(env: Env) -> Result<(), RegistryError>
pub fn pending_admin(env: Env) -> Option<Address>
```

Two-step admin transfer flow (AM-031):
- `get_admin`: Return the current active admin address (errors with `NotInitialized` before `initialize`).
- `set_admin`: Current admin nominates `new_admin` as `PendingAdmin` (requires current admin auth; rejects self-nomination with `Unauthorized`).
- `accept_admin`: Nominated `PendingAdmin` accepts and becomes the active `Admin`, clearing `PendingAdmin` (requires pending admin auth; errors with `NoPendingAdmin` if none is pending).
- `cancel_admin_transfer`: Current admin cancels a pending transfer, clearing `PendingAdmin` (requires current admin auth; errors with `NoPendingAdmin` if none is pending).
- `pending_admin`: Returns `Some(address)` when a transfer is pending, or `None`.

