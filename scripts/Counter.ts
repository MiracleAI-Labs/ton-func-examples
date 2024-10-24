import { Address, beginCell } from "@ton/core";
import { Mai3Contract } from "../libs/Mai3Contract";
import { Network } from "@orbs-network/ton-access";

export class Counter extends Mai3Contract {

    async deploy() {    
        const files = ["contracts/Counter.fc"];
        const data = beginCell().storeUint(100, 64).endCell();

        const network = (process.env.NETWORK || "testnet") as Network;
        const mnemonic = process.env.MNEMONIC || "";

        console.log("Deploying contract...");
        console.log("Network: ", network);
        console.log("Mnemonic: ", mnemonic);
    
        return await this.deployContract({files, data, network, mnemonic});
    }

    async setCounter(address: Address, value: number) {
        const network = (process.env.NETWORK || "testnet") as Network;
        const mnemonic = process.env.MNEMONIC || "";

        const isDeployed = await this.isDeployed(address, network);
        if (!isDeployed) {
            throw new Error("合约未部署");
        }

        const body = beginCell().storeUint(1, 32).storeUint(0, 64).storeUint(value, 64).endCell();

        return await this.invokeMethod({address, body, network, mnemonic});
    }
}