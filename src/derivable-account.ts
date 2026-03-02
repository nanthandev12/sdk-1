import {
  AccountAddress,
  AuthenticationKey,
  hashValues,
  isValidFunctionInfo,
  Serializable,
  Serializer,
} from "@aptos-labs/ts-sdk";
import { getAddress } from "ethers";

const DOMAIN = "app.decibel.trade";
const ETH_AUTH_FN = "0x1::ethereum_derivable_account::authenticate";
const SOL_AUTH_FN = "0x1::solana_derivable_account::authenticate";

class DerivableAbstractPublicKey extends Serializable {
  constructor(
    public identity: string,
    public domain: string,
  ) {
    super();
  }

  serialize(serializer: Serializer): void {
    serializer.serializeStr(this.identity);
    serializer.serializeStr(this.domain);
  }
}

function deriveAptosAddress(authFn: string, identity: string): string {
  if (!isValidFunctionInfo(authFn)) {
    throw new Error(`Invalid auth function: ${authFn}`);
  }
  const parts = authFn.split("::") as [string, string, string];
  const s1 = new Serializer();
  AccountAddress.fromString(parts[0]).serialize(s1);
  s1.serializeStr(parts[1]);
  s1.serializeStr(parts[2]);

  const s2 = new Serializer();
  s2.serializeBytes(new DerivableAbstractPublicKey(identity, DOMAIN).bcsToBytes());

  const data = hashValues([s1.toUint8Array(), s2.toUint8Array(), new Uint8Array([5])]);
  return new AuthenticationKey({ data }).derivedAddress().toString();
}

/**
 * Derive an Aptos account address from an Ethereum wallet address
 * using the derivable account pattern (scheme byte 0x05).
 *
 * The ETH address is checksummed via EIP-55 before derivation.
 */
export function deriveAptosFromEth(ethAddress: string): string {
  return deriveAptosAddress(ETH_AUTH_FN, getAddress(ethAddress));
}

/**
 * Derive an Aptos account address from a Solana wallet address
 * using the derivable account pattern (scheme byte 0x05).
 *
 * The Solana address (base58) is used as-is.
 */
export function deriveAptosFromSolana(solAddress: string): string {
  return deriveAptosAddress(SOL_AUTH_FN, solAddress);
}
