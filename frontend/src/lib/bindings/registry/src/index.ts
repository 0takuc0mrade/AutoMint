// @ts-nocheck
import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4",
  }
} as const

export type DataKey = {tag: "UserProfile", values: readonly [string]} | {tag: "Username", values: readonly [string]} | {tag: "UserTombstone", values: readonly [string]} | {tag: "UserPage", values: readonly [u32]} | {tag: "TopUsers", values: void} | {tag: "PageCount", values: void} | {tag: "TotalUsers", values: void} | {tag: "Admin", values: void} | {tag: "Initialized", values: void} | {tag: "Writers", values: void};


export interface Writers {
  accrual: string;
  bot_nft: string;
}


export interface UserProfile {
  address: string;
  bot_count: u32;
  claimed_amt: i128;
  registered_at: u64;
  total_points: u64;
  username: string;
}

export const Errors = {
  1: {message:"AlreadyInitialized"},

  2: {message:"AlreadyRegistered"},

  3: {message:"UsernameTaken"},

  4: {message:"NotRegistered"},

  5: {message:"Unauthorized"},

  6: {message:"NotInitialized"},

  /**
   * The registered-user counter has reached `u32::MAX`, or a points update
   * would overflow `u64`.
   */
  7: {message:"Overflow"},

  /**
   * A single `add_points` update exceeded `MAX_POINTS_PER_CALL` (#363).
   */
  8: {message:"ImplausiblePoints"}
}

export interface UserTombstone {
  address: string;
  claimed_amt: i128;
  total_points: u64;
  unregistered_at: u64;
  username: string;
}


export interface Client {
  /**
   * Construct and simulate a get_user transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_user: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<UserProfile>>>

  /**
   * Construct and simulate a register transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  register: ({user, username}: {user: string, username: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a get_users transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_users: ({page}: {page: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a add_points transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_points: ({user, points}: {user: string, points: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin}: {admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_points transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_points: ({user, value}: {user: string, value: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a unregister transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unregister: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_writers transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_writers: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Writers>>>

  /**
   * Construct and simulate a set_writers transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_writers: ({accrual, bot_nft}: {accrual: string, bot_nft: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a total_users transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_users: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a bump_profile transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bump_profile: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a is_registered transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_registered: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a add_claimed_amt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_claimed_amt: ({user, amount}: {user: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_leaderboard transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Top users by points, highest first. Reads the maintained `TopUsers`
   * list and hydrates at most `min(limit, LEADERBOARD_SIZE)` profiles, so the
   * cost does not depend on the total number of users. Equal totals are
   * ordered by who reached the total first (earlier wins), deterministically.
   */
  get_leaderboard: ({limit}: {limit: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<UserProfile>>>

  /**
   * Construct and simulate a get_users_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Fetch profiles for up to `MAX_USERS_BATCH` addresses in a single call,
   * in the same order as `addresses`. Unregistered addresses map to `None`.
   */
  get_users_batch: ({addresses}: {addresses: Array<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<Array<Option<UserProfile>>>>>

  /**
   * Construct and simulate a decrement_bot_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  decrement_bot_count: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a increment_bot_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  increment_bot_count: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAIZ2V0X3VzZXIAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAPpAAAH0AAAAAtVc2VyUHJvZmlsZQAAAAfQAAAADVJlZ2lzdHJ5RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAIcmVnaXN0ZXIAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAIdXNlcm5hbWUAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANUmVnaXN0cnlFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAANUmVnaXN0cnlFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAJZ2V0X3VzZXJzAAAAAAAAAQAAAAAAAAAEcGFnZQAAAAQAAAABAAAD6gAAABM=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACgAAAAEAAAAAAAAAC1VzZXJQcm9maWxlAAAAAAEAAAATAAAAAQAAAAAAAAAIVXNlcm5hbWUAAAABAAAAEAAAAAEAAAAAAAAADVVzZXJUb21ic3RvbmUAAAAAAAABAAAAEwAAAAEAAAAAAAAACFVzZXJQYWdlAAAAAQAAAAQAAAAAAAAAr0JvdW5kZWQgbGVhZGVyYm9hcmQgKCMzMzIpOiBgVmVjPChBZGRyZXNzLCB1NjQpPmAgb2YgYXQgbW9zdApgTEVBREVSQk9BUkRfU0laRWAgZW50cmllcywgc29ydGVkIGJ5IHBvaW50cyBkZXNjZW5kaW5nLiBUaWVzOiB0aGUgdXNlcgp3aG8gcmVhY2hlZCB0aGF0IHRvdGFsIGZpcnN0IHJhbmtzIGhpZ2hlci4AAAAACFRvcFVzZXJzAAAAAAAAAKROdW1iZXIgb2YgYWxsb2NhdGVkIGBVc2VyUGFnZWAgYnVja2V0cyAoIzM1OCksIHNvIGBnZXRfdXNlcnNgIGNhbiBib3VuZAppdHMgc2NhbiB0byBsaXZlIHBhZ2VzIHdoaWxlIHRoZSB1c2VyIGxpc3Rpbmcgc3RheXMgb3V0IG9mIHRoZQpldmVyLWdyb3dpbmcgaW5zdGFuY2UgdmVjdG9yLgAAAAlQYWdlQ291bnQAAAAAAAAAAAAAAAAAAApUb3RhbFVzZXJzAAAAAAAAAAAAAAAAAAVBZG1pbgAAAAAAAAAAAAAAAAAAC0luaXRpYWxpemVkAAAAAAAAAAAAAAAAB1dyaXRlcnMA",
        "AAAAAQAAAAAAAAAAAAAAB1dyaXRlcnMAAAAAAgAAAAAAAAAHYWNjcnVhbAAAAAATAAAAAAAAAAdib3RfbmZ0AAAAABM=",
        "AAAAAAAAAAAAAAAKYWRkX3BvaW50cwAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABnBvaW50cwAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADVJlZ2lzdHJ5RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANUmVnaXN0cnlFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAKc2V0X3BvaW50cwAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABXZhbHVlAAAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADVJlZ2lzdHJ5RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAKdW5yZWdpc3RlcgAAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1SZWdpc3RyeUVycm9yAAAA",
        "AAAAAAAAAAAAAAALZ2V0X3dyaXRlcnMAAAAAAAAAAAEAAAPoAAAH0AAAAAdXcml0ZXJzAA==",
        "AAAAAAAAAAAAAAALc2V0X3dyaXRlcnMAAAAAAgAAAAAAAAAHYWNjcnVhbAAAAAATAAAAAAAAAAdib3RfbmZ0AAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1SZWdpc3RyeUVycm9yAAAA",
        "AAAAAAAAAAAAAAALdG90YWxfdXNlcnMAAAAAAAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAMYnVtcF9wcm9maWxlAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1SZWdpc3RyeUVycm9yAAAA",
        "AAAAAAAAAAAAAAANaXNfcmVnaXN0ZXJlZAAAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAE=",
        "AAAAAQAAAAAAAAAAAAAAC1VzZXJQcm9maWxlAAAAAAYAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAJYm90X2NvdW50AAAAAAAABAAAAAAAAAALY2xhaW1lZF9hbXQAAAAACwAAAAAAAAANcmVnaXN0ZXJlZF9hdAAAAAAAAAYAAAAAAAAADHRvdGFsX3BvaW50cwAAAAYAAAAAAAAACHVzZXJuYW1lAAAAEA==",
        "AAAAAAAAAAAAAAAPYWRkX2NsYWltZWRfYW10AAAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1SZWdpc3RyeUVycm9yAAAA",
        "AAAAAAAAARtUb3AgdXNlcnMgYnkgcG9pbnRzLCBoaWdoZXN0IGZpcnN0LiBSZWFkcyB0aGUgbWFpbnRhaW5lZCBgVG9wVXNlcnNgCmxpc3QgYW5kIGh5ZHJhdGVzIGF0IG1vc3QgYG1pbihsaW1pdCwgTEVBREVSQk9BUkRfU0laRSlgIHByb2ZpbGVzLCBzbyB0aGUKY29zdCBkb2VzIG5vdCBkZXBlbmQgb24gdGhlIHRvdGFsIG51bWJlciBvZiB1c2Vycy4gRXF1YWwgdG90YWxzIGFyZQpvcmRlcmVkIGJ5IHdobyByZWFjaGVkIHRoZSB0b3RhbCBmaXJzdCAoZWFybGllciB3aW5zKSwgZGV0ZXJtaW5pc3RpY2FsbHkuAAAAAA9nZXRfbGVhZGVyYm9hcmQAAAAAAQAAAAAAAAAFbGltaXQAAAAAAAAEAAAAAQAAA+oAAAfQAAAAC1VzZXJQcm9maWxlAA==",
        "AAAABAAAAAAAAAAAAAAADVJlZ2lzdHJ5RXJyb3IAAAAAAAAIAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEUFscmVhZHlSZWdpc3RlcmVkAAAAAAAAAgAAAAAAAAANVXNlcm5hbWVUYWtlbgAAAAAAAAMAAAAAAAAADU5vdFJlZ2lzdGVyZWQAAAAAAAAEAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAFAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAABgAAAFxUaGUgcmVnaXN0ZXJlZC11c2VyIGNvdW50ZXIgaGFzIHJlYWNoZWQgYHUzMjo6TUFYYCwgb3IgYSBwb2ludHMgdXBkYXRlCndvdWxkIG92ZXJmbG93IGB1NjRgLgAAAAhPdmVyZmxvdwAAAAcAAABDQSBzaW5nbGUgYGFkZF9wb2ludHNgIHVwZGF0ZSBleGNlZWRlZCBgTUFYX1BPSU5UU19QRVJfQ0FMTGAgKCMzNjMpLgAAAAARSW1wbGF1c2libGVQb2ludHMAAAAAAAAI",
        "AAAAAQAAAAAAAAAAAAAADVVzZXJUb21ic3RvbmUAAAAAAAAFAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAAC2NsYWltZWRfYW10AAAAAAsAAAAAAAAADHRvdGFsX3BvaW50cwAAAAYAAAAAAAAAD3VucmVnaXN0ZXJlZF9hdAAAAAAGAAAAAAAAAAh1c2VybmFtZQAAABA=",
        "AAAAAAAAAAAAAAATZGVjcmVtZW50X2JvdF9jb3VudAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADVJlZ2lzdHJ5RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAATaW5jcmVtZW50X2JvdF9jb3VudAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADVJlZ2lzdHJ5RXJyb3IAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_user: this.txFromJSON<Result<UserProfile>>,
        register: this.txFromJSON<Result<void>>,
        get_admin: this.txFromJSON<Result<string>>,
        get_users: this.txFromJSON<Array<string>>,
        add_points: this.txFromJSON<Result<void>>,
        initialize: this.txFromJSON<Result<void>>,
        set_points: this.txFromJSON<Result<void>>,
        unregister: this.txFromJSON<Result<void>>,
        get_writers: this.txFromJSON<Option<Writers>>,
        set_writers: this.txFromJSON<Result<void>>,
        total_users: this.txFromJSON<u32>,
        bump_profile: this.txFromJSON<Result<void>>,
        is_registered: this.txFromJSON<boolean>,
        add_claimed_amt: this.txFromJSON<Result<void>>,
        get_leaderboard: this.txFromJSON<Array<UserProfile>>,
        get_users_batch: this.txFromJSON<Result<Array<Option<UserProfile>>>>,
        decrement_bot_count: this.txFromJSON<Result<void>>,
        increment_bot_count: this.txFromJSON<Result<void>>
  }
}