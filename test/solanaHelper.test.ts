import { signSolanaMessage } from "../src/common/helpers/solanaHelper";
import { Keypair } from "@solana/web3.js";

describe("SolanaSigner", () => {
    const keypair = Keypair.generate();

    it("should sign valid message", () => {
        const sig = signSolanaMessage("Hello Solana", keypair.secretKey);
        expect(sig).toBeInstanceOf(Uint8Array);
        expect(sig.length).toBe(64);
    });

    it("should reject invalid key lenght", () => {
        expect(() => signSolanaMessage("test", new Uint8Array(32)))
        .toThrow("must be 64-byte");
    });
});