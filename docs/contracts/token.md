# AMT Token Contract API Reference

The AMT Token contract is a Soroban-based token implementation with
admin-controlled minting, burning, and allowance-based transfers. It implements
`soroban_sdk::token::TokenInterface` for standard token clients while retaining
typed `Result` errors on the AMT-specific contract client.

## Public Functions

### initialize

```rust
pub fn initialize(
  env: Env,
  admin: Address,
  decimal: u32,
  name: String,
  symbol: String,
) -> Result<(), TokenError>
```

Initialize the token contract with metadata and admin address.

- `admin`: The address that can mint and burn tokens, and transfer admin rights
- `decimal`: Number of decimal places (must be > 0)
- `name`: Human-readable name (e.g., "AutoMint Token")
- `symbol`: Token symbol (e.g., "AMT")

Returns `TokenError::AlreadyInitialized` if called twice.

---

### balance

```rust
pub fn balance(env: Env, id: Address) -> i128
```

Query the token balance for an address. Returns 0 if the address has no balance record.

---

### spendable_balance

```rust
pub fn spendable_balance(env: Env, id: Address) -> i128
```

Query the portion of `balance` that is actually transferable right now (SEP-41). Equals `balance` minus any reserve held in a (currently unused) `Locked` entry for `id`; returns 0 for an address with no balance record.

---

### bump_balance

```rust
pub fn bump_balance(env: Env, id: Address)
```

Permissionless keeper call that refreshes `id`'s balance entry TTL without modifying its amount. Anyone may call this; it is a no-op if `id` has no balance record. See [Balance TTL](#balance-ttl) below.

---

### transfer

```rust
pub fn transfer(
  env: Env,
  from: Address,
  to: Address,
  amount: i128,
) -> Result<(), TokenError>
```

Transfer tokens from one address to another. Requires authorization from `from`.

- Zero amounts are no-ops and return `Ok(())`
- Negative amounts return `TokenError::NegativeAmount`
- `from == to` returns `TokenError::Unauthorized`
- Insufficient balance returns `TokenError::InsufficientBalance`

---

### transfer_from

```rust
pub fn transfer_from(
  env: Env,
  spender: Address,
  from: Address,
  to: Address,
  amount: i128,
) -> Result<(), TokenError>
```

Transfer tokens on behalf of another address using an allowance. Requires authorization from `spender`.

- Validates negative amounts before checking allowance
- Zero amounts are no-ops and return `Ok(())`
- `spender == from` returns `TokenError::Unauthorized`
- `from == to` returns `TokenError::Unauthorized`
- Expired allowance returns `TokenError::AllowanceExpired`
- Insufficient allowance returns `TokenError::InsufficientAllowance`
- Insufficient balance returns `TokenError::InsufficientBalance`

---

### approve

```rust
pub fn approve(
  env: Env,
  from: Address,
  spender: Address,
  amount: i128,
  expiration_ledger: u32,
) -> Result<(), TokenError>
```

Approve a spender to transfer up to `amount` tokens from `from`. Requires authorization from `from`.

- Negative amounts return `TokenError::NegativeAmount`
- Zero amounts are valid and stored as 0 allowance; a zero amount may use a past `expiration_ledger` as a revoke
- A non-zero amount with `expiration_ledger` in the past returns `TokenError::InvalidExpiration`
- An `expiration_ledger` beyond the network's maximum allowance window returns `TokenError::InvalidExpiration`
- #341: self-approval (`from == spender`) is permitted per SEP-41

---

### allowance

```rust
pub fn allowance(env: Env, from: Address, spender: Address) -> i128
```

Query the remaining allowance for a spender to transfer from `from`. Returns 0 if:
- No allowance record exists
- The allowance has expired

---

### mint

```rust
pub fn mint(env: Env, to: Address, amount: i128) -> Result<(), TokenError>
```

Mint new tokens. Requires admin authorization.

- Zero amounts are no-ops and return `Ok(())`
- Negative amounts return `TokenError::NegativeAmount`
- Overflow returns `TokenError::Overflow`

---

### burn

```rust
pub fn burn(env: Env, from: Address, amount: i128) -> Result<(), TokenError>
```

Burn tokens from an address. Requires authorization from `from`.

- Zero amounts are no-ops and return `Ok(())`
- Negative amounts return `TokenError::NegativeAmount`
- Insufficient balance returns `TokenError::InsufficientBalance`

---

### set_admin

```rust
pub fn set_admin(env: Env, new_admin: Address) -> Result<(), TokenError>
```

Propose an administrator transfer. Requires authorization from the current admin;
the current admin remains active until `new_admin` calls `accept_admin`.

- `new_admin == current_admin` returns `TokenError::Unauthorized`
- Contract not initialized returns `TokenError::NotInitialized`

---

### accept_admin, cancel_admin_transfer, pending_admin

```rust
pub fn accept_admin(env: Env) -> Result<(), TokenError>
pub fn cancel_admin_transfer(env: Env) -> Result<(), TokenError>
pub fn pending_admin(env: Env) -> Option<Address>
```

Only the proposed address can accept a pending transfer. The current admin can
cancel it; both actions clear `pending_admin`. `accept_admin` and
`cancel_admin_transfer` return `TokenError::NoPendingAdmin` when no proposal is
pending.

---

### set_metadata

```rust
pub fn set_metadata(env: Env, name: String, symbol: String) -> Result<(), TokenError>
```

Updates the token name and symbol and emits a `metadata` event containing the
old and new values. Only the current admin may call it, and both values must be
non-empty. Token decimals remain immutable: changing precision would silently
reprice every existing integer balance.

---

### admin

```rust
pub fn admin(env: Env) -> Result<Address, TokenError>
```

Query the current admin address. Returns `TokenError::NotInitialized` if the contract is not initialized.

---

### decimals

```rust
pub fn decimals(env: Env) -> Result<u32, TokenError>
```

Query the number of decimal places. Returns `TokenError::NotInitialized` if the contract is not initialized.

---

### name

```rust
pub fn name(env: Env) -> Result<String, TokenError>
```

Query the token name. Returns `TokenError::NotInitialized` if the contract is not initialized.

---

### symbol

```rust
pub fn symbol(env: Env) -> Result<String, TokenError>
```

Query the token symbol. Returns `TokenError::NotInitialized` if the contract is not initialized.

---

## Error Codes

| Error | Code | Description |
|-------|------|-------------|
| `AlreadyInitialized` | 1 | Contract was already initialized |
| `NotInitialized` | 2 | Contract has not been initialized |
| `Unauthorized` | 3 | Caller is not authorized for this action |
| `InsufficientBalance` | 4 | Account does not have enough balance |
| `InsufficientAllowance` | 5 | Allowance is not sufficient for the transfer |
| `NegativeAmount` | 6 | Amount is negative |
| `AllowanceExpired` | 7 | Allowance has expired |
| `Overflow` | 8 | Arithmetic overflow occurred |
| `SupplyCapExceeded` | 9 | Mint would exceed the configured max supply |
| `InvalidDecimals` | 10 | `decimal` was 0 at `initialize` |
| `InvalidExpiration` | 11 | `approve`'s `expiration_ledger` is in the past (for a non-zero amount) or beyond the maximum allowance window |
| `InvalidMetadata` | 12 | Name or symbol is empty |
| `NoPendingAdmin` | 13 | No administrator transfer is pending |
| `Paused` | 1000 | Contract is paused |

---

## Balance TTL

Balance entries are persistent storage, bumped to the network's maximum entry TTL (3,110,400 ledgers, ≈180 days at 5s/ledger) on every `mint`, `transfer`, `burn`/`burn_from`, or `bump_balance` call. The private storage helpers own those TTL extensions; public callers do not extend TTL directly. `balance()` and `spendable_balance()` are read-only and never extend TTL. A holder that transacts at least once within that window never archives; `bump_balance(id)` lets anyone (a keeper, a wallet, the holder) refresh a dormant balance's TTL without touching its amount.

---

## Events

The contract emits the following events, matching the Stellar Asset Contract (SAC) topic/data convention `topics = (name, ...addresses)`, `data = payload`:

| Function | Topics | Data |
|----------|--------|------|
| `transfer` | `("transfer", from, to)` | `amount: i128` |
| `mint` | `("mint", admin, to)` | `amount: i128` |
| `burn` | `("burn", from)` | `amount: i128` |
| `approve` | `("approve", from, spender)` | `(amount: i128, expiration_ledger: u32)` |
| `admin_proposed` | `("admin_proposed", current_admin)` | `pending_admin: Address` |
| `set_admin` | `("set_admin", old_admin)` | `new_admin: Address` |
| `admin_cancel` | `("admin_cancel",)` | `cancelled_admin: Address` |
| `metadata` | `("metadata",)` | `(old_name, old_symbol, new_name, new_symbol)` |
