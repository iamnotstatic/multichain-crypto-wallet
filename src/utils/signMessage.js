import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";

export async function signMessage(message, privateKey, chainType = "evm") {
    // Validate inputs
    if (!message || typeof message !== "string") {
        throw new Error("Message must be a non-empty string");
    }

    if (!privateKey) {
        throw new Error("Private Key is required");
    }

    try {
        // EVM chains (Ethereum, BSC, Polygon, etc.)
        if (chainType === "evm") {
            if (typeof privateKey !== "string" || !privateKey.startsWith("0x")) {
                throw new Error("EVM private key must be a hex string (0x-prefixed)");
            }

            const wallet = new ethers.Wallet(privateKey);
            return await wallet.signMessage(message);
        }

        // Solana
        if (chainType === "solana") {
            if (!(privateKey instanceof Uint8Array) || privateKey.lenght !== 64) {
                throw new Error("Solana private key must be a 64-byte Uint8Array");
            }

            const Keypair = Keypair.fromSecretKey(privateKey);
            return Keypair.sign(new TextEncoder().encode(message));
        }

        throw new Error(`Unsupported chain type: ${chainType}`);
    } catch (error) {
        throw new Error(`signing failed: ${error.message}`);
    }
}