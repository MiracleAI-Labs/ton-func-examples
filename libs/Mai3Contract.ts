import { Address } from '@ton/core';

import { BaseContract, DeployContractParams, InvokeContractParams } from "./BaseContract";
import { Network } from '@orbs-network/ton-access';

export class Mai3Contract {

    async deployContract(deployParams: DeployContractParams) {    
        return await BaseContract.deployContract(deployParams);
    }

    async invokeMethod(invokeParams: InvokeContractParams) {    
        return await BaseContract.invokeMethod(invokeParams);
    }

    async isDeployed(address: Address, network: Network) {    
        return await BaseContract.isDeployed(address, network);
    }
}