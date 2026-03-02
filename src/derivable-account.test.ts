import { describe, expect, it } from "vitest";

import { deriveAptosFromEth, deriveAptosFromSolana } from "./derivable-account";

describe("deriveAptosFromEth", () => {
  it("produces a 66-char lowercase 0x-prefixed address", () => {
    const result = deriveAptosFromEth("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    expect(result).toMatch(/^0x[a-f0-9]{64}$/);
    expect(result).toHaveLength(66);
  });

  it("is deterministic", () => {
    const addr = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    expect(deriveAptosFromEth(addr)).toBe(deriveAptosFromEth(addr));
  });

  it("normalizes case before derivation (same address, different case = same result)", () => {
    const lower = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
    const mixed = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    expect(deriveAptosFromEth(lower)).toBe(deriveAptosFromEth(mixed));
  });

  it("different ETH addresses produce different Aptos addresses", () => {
    const a = deriveAptosFromEth("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    const b = deriveAptosFromEth("0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B");
    expect(a).not.toBe(b);
  });

  it("throws on invalid ETH address", () => {
    expect(() => deriveAptosFromEth("not-an-address")).toThrow();
  });
});

describe("deriveAptosFromSolana", () => {
  it("produces a 66-char lowercase 0x-prefixed address", () => {
    const result = deriveAptosFromSolana("11111111111111111111111111111111");
    expect(result).toMatch(/^0x[a-f0-9]{64}$/);
    expect(result).toHaveLength(66);
  });

  it("is deterministic", () => {
    const addr = "11111111111111111111111111111111";
    expect(deriveAptosFromSolana(addr)).toBe(deriveAptosFromSolana(addr));
  });

  it("different Solana addresses produce different Aptos addresses", () => {
    const a = deriveAptosFromSolana("11111111111111111111111111111111");
    const b = deriveAptosFromSolana("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    expect(a).not.toBe(b);
  });
});
