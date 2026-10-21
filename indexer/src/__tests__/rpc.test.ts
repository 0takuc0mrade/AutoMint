import { describe, it, expect } from "vitest";
import { isTransientError } from "../rpc.js";

/** An axios-style HTTP error: the status lives on `response.status`. */
function httpError(status: number): Error {
  return Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status },
  });
}

describe("isTransientError (#1229)", () => {
  it("does not treat 5-prefixed numbers in a message as a 5xx", () => {
    expect(
      isTransientError(new Error("startLedger must be between 51234 and 61234")),
    ).toBe(false);
  });

  it("does not retry JSON-RPC error objects", () => {
    expect(
      isTransientError({ code: -32600, message: "startLedger must be between 51234 and 61234" }),
    ).toBe(false);
  });

  it("retries 429 and 5xx responses by HTTP status", () => {
    expect(isTransientError(httpError(429))).toBe(true);
    expect(isTransientError(httpError(500))).toBe(true);
    expect(isTransientError(httpError(503))).toBe(true);
  });

  it("does not retry other HTTP statuses", () => {
    expect(isTransientError(httpError(400))).toBe(false);
    expect(isTransientError(httpError(404))).toBe(false);
  });

  it("retries network failures without an HTTP response", () => {
    expect(isTransientError(new Error("connect ECONNREFUSED 127.0.0.1:8000"))).toBe(true);
    expect(isTransientError(new Error("timeout of 30000ms exceeded"))).toBe(true);
  });
});
