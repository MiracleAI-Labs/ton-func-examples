
import { BaseContract, DeployContractParams, InvokeContractParams } from "./BaseContract";

export class Mai3Contract {

    async deployContract(deployParams: DeployContractParams) {    
        return await BaseContract.deployContract(deployParams);
    }

    async invokeMethod(invokeParams: InvokeContractParams) {    
        return await BaseContract.invokeMethod(invokeParams);
    }
}