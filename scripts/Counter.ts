import { Address, beginCell } from "@ton/core";
import { Mai3Contract } from "../libs/Mai3Contract";

const network = "testnet";
const mnemonic = "link rain venue myself review orange educate rich conduct admit fee anchor taste resemble plug page agent toilet industry vintage gate clutch shy evolve";

export class Counter extends Mai3Contract {

    async deploy() {    
        const files = ["contracts/Counter.fc"];
        const data = beginCell().storeUint(100, 64).endCell();
    
        return await this.deployContract({files, data, network, mnemonic});
    }

    async setCounter(address: Address, value: number) {
        const body = beginCell().storeUint(1, 32).storeUint(0, 64).storeUint(value, 64).endCell();
    
        return await this.invokeMethod({address, body, network, mnemonic});
    }
}