/** create by MiracleAI (mai3.io) */
import { getHttpEndpoint, Network } from "@orbs-network/ton-access";
import { Address, beginCell, Cell, Contract, contractAddress, ContractGetMethodResult, ContractProvider, fromNano, Sender, SendMode, StateInit, toNano, TupleItem, TupleReader } from "@ton/core";
import { Maybe } from "@ton/core/dist/utils/maybe";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4 } from "@ton/ton";
import { compileContract } from "ton-compiler";

export interface DeployContractParams {
    files: string[];
    data: Cell;
    network: Network;
    mnemonic: string;
}

export interface SendMessageParams {
    address: Address;
    body: Cell;
    network: Network;
    mnemonic: string;
}

export interface GetMessageParams {
    address: Address;
    network: Network;
    mnemonic: string;
    methodId: string;
    args: TupleItem[];
}

export class BaseContract implements Contract {
    address: Address;
    init?: Maybe<StateInit>;

    constructor(address: Address, init?: Maybe<StateInit>) {
        this.address = address;
        this.init = init;
    }

    static createFromAddress(address: Address): BaseContract {
        return new BaseContract(address);
    }

    static createFromData(code: Cell, data: Cell, workchain: number = 0): BaseContract {
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new BaseContract(address, init);
    }

    async sendDeploy(provider: ContractProvider, sender: Sender, value: bigint) {
        await provider.internal(sender, {
            value,
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendCallMethod(provider: ContractProvider, sender: Sender, value: bigint, body: Cell) {
        await provider.internal(sender, {
            value,
            bounce: true,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async getCallMethod(provider: ContractProvider, methodId: string, args: TupleItem[] = []): Promise<ContractGetMethodResult> {
        const result = await provider.get(methodId, args);
        return result;
    }
    
    private static async getContractCode(files: string[]): Promise<Cell | null> {    
        const compileResult = await compileContract({ files, stdlib: true });    
        if (compileResult.ok) {        
            return Cell.fromBoc(compileResult.output)[0];    
        }         
        console.error(compileResult.log);        
        return null;
    }

    private static async setupWallet(mnemonic: string, network: Network) {
        const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));    
        const walletContract = WalletContractV4.create({        
            publicKey: keyPair.publicKey,        
            workchain: 0 
        });

        const httpEndpoint = await getHttpEndpoint({ network });
        const tonClient = new TonClient({ endpoint: httpEndpoint });    
        const openWallet = tonClient.open(walletContract);
        const sender = openWallet.sender(keyPair.secretKey);

        console.log("sender address: ", openWallet.address);
        const balance = await openWallet.getBalance();
        console.log("sender balance: ", fromNano(balance));

        return { tonClient, sender };
    }

    static async deployContract(deployParams: DeployContractParams) {    
        const contractCode = await BaseContract.getContractCode(deployParams.files);    
        if (!contractCode) {        
            console.error("Unable to get contract code");
            return;    
        }

        const deployContract = BaseContract.createFromData(contractCode, deployParams.data);    
        console.log("Contract address: ", deployContract.address);

        const isDeployed = await this.isDeployed(deployContract.address, deployParams.network);
        if (isDeployed) {
            console.log("Contract already deployed");
            return deployContract.address;
        }

        const { tonClient, sender } = await BaseContract.setupWallet(deployParams.mnemonic, deployParams.network);

        const openDeployContract = tonClient.open(deployContract);
        await openDeployContract.sendDeploy(sender, toNano(0.1));

        console.log("Contract deployed successfully");

        return deployContract.address;
    }

    static async sendMessage(args: SendMessageParams) {    
        const contract = BaseContract.createFromAddress(args.address);

        const { tonClient, sender } = await BaseContract.setupWallet(args.mnemonic, args.network);

        const openContract = tonClient.open(contract);
        await openContract.sendCallMethod(sender, toNano(0.1), args.body);

        return contract.address;
    }

    static async getMessage(args: GetMessageParams) {    
        const contract = BaseContract.createFromAddress(args.address);
        const httpEndpoint = await getHttpEndpoint({ network: args.network });
        const tonClient = new TonClient({ endpoint: httpEndpoint });  

        const openContract = tonClient.open(contract);
        const result = await openContract.getCallMethod(args.methodId, args.args);

        return result;
    }

    static async isDeployed(address: Address, network: Network) {    
        const httpEndpoint = await getHttpEndpoint({ network });
        const tonClient = new TonClient({ endpoint: httpEndpoint });    
        const isDeployed = await tonClient.isContractDeployed(address);

        return isDeployed;
    }
}