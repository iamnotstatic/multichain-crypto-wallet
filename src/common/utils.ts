import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

export function isValidPolkadotAddress(address: string, ss58Format: number = 0): boolean {
    try {
        const decoded = decodeAddress(address);
        const reEncoded = encodeAddress(decoded, ss58Format);
        return reEncoded === address;
    } catch (error) {
        return false;
    }
}