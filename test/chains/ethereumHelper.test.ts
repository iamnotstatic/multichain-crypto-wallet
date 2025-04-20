import { signEvmMessage } from "../../src/common/helpers/ethereumHelper";
import { ethers } from "ethers";

describe("EVMSigner", () => {
    const wallet = ethers.Wallet.createRandom();

    it("should sign valid message", async () => {
        const sig = await signEvmMessage("Hello EVM", wallet.privateKey);
        expect(sig).toMatch(/^0x[a-f0-9]{130}$/);
    });

    it("should reject empty message", async () => {
        await expect(signEvmMessage("", wallet.privateKey))
        .rejects.toThrow("Message cannot be empty");
    });

    it("should reject invalid private key", async () => {
        await expect(signEvmMessage("test", "0xinvalid"))
        .rejects.toThrow("must be 64-byte hex");
    });
});