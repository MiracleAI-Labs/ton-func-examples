/** create by MiracleAI (mai3.io) */
import { Address } from '@ton/core';
import { BaseContract, DeployContractParams, SendMessageParams, GetMessageParams } from "./BaseContract";
import { Network } from '@orbs-network/ton-access';

export class Mai3Contract {

    async deployContract(deployParams: DeployContractParams) {    
        return await BaseContract.deployContract(deployParams);
    }

    async sendMessage(params: SendMessageParams) {    
        return await BaseContract.sendMessage(params);
    }

    async getMessage(params: GetMessageParams) {    
        return await BaseContract.getMessage(params);
    }

    async isDeployed(address: Address, network: Network) {    
        return await BaseContract.isDeployed(address, network);
    }
}