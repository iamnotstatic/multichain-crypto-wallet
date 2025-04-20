import { signMessage } from "../src/services/wallet/index";
import { Network } from "../src/common/utils/types"; 
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";

describe("signMessage", () => {
    // EVM Test
    describe("EVM", () => {
        it("should sign a message with a valid EVM private key", async () => {
            const wallet = ethers.Wallet.createRandom();
            const signature = await signMessage("test", wallet.privateKey, "ethereum");
            expect(signature).toMatch(/^0x[a-fA-f0-9]+$/); // Hex signature
        });

        it("should throw for invalid EVM private key", async () => {
            await expect(signMessage("test", "invalid-key", "ethereum")).rejects.toThrow();
        });
    }) ;

    // Solana Tests
    describe("Solana", () => {
        it("should sign a message with a valid Solana private key", async () => {
            const keypair = Keypair.generate();
            const signature = await signMessage("test", keypair.secretKey, "solana");
            expect(signature).toBeInstanceOf(Uint8Array);
        });

        it("should throw for invalid Solana private key", async () => {
            await expect(signMessage("test", new Uint8Array(32), "solana")).rejects.toThrow();
        });
    });

    // Edge Cases
    it("should throw for unsupported chain type", async () => {
        await expect(signMessage("test", "0x123", "unsupported-chain" as unknown as Network)).rejects.toThrow();
    });

    it("should throw for empty message", async () => {
        await expect(signMessage("", "0x123", "ethereum")).rejects.toThrow();
    });
});