import {
    AnchorMode,
    PostConditionMode,
    makeContractCall,
    uintCV,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet, StacksMocknet } from '@stacks/network';

export const CONTRACT_ADDRESS = 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';
export const CONTRACT_NAME = 'spinning-board';

export class SpinningBoardSDK {
    constructor(options = {}) {
        this.networkType = options.network || 'mainnet';
        this.coreApiUrl = options.coreApiUrl;

        if (this.networkType === 'mainnet') {
            this.network = new StacksMainnet({ url: this.coreApiUrl });
        } else if (this.networkType === 'testnet') {
            this.network = new StacksTestnet({ url: this.coreApiUrl });
        } else {
            this.network = new StacksMocknet({ url: this.coreApiUrl });
        }

        this.contractAddress = options.contractAddress || CONTRACT_ADDRESS;
        this.contractName = options.contractName || CONTRACT_NAME;
    }

    /**
     * Prepares a transaction to play the spinning board game
     * @param {Object} params 
     * @param {number} params.spinValue A number between 1 and 10 representing the spin result
     * @param {string} params.senderKey The private key of the sender
     * @param {number|bigint} [params.nonce] Optional nonce for the transaction
     * @param {number|bigint} [params.fee] Optional fee override in microSTX
     * @returns {Promise<import('@stacks/transactions').StacksTransaction>}
     */
    async buildPlayTransaction(params) {
        const { spinValue, senderKey, nonce, fee } = params;

        if (!Number.isInteger(spinValue) || spinValue < 1 || spinValue > 10) {
            throw new Error(`Invalid spinValue "${spinValue}". Must be an integer between 1 and 10.`);
        }

        const txOptions = {
            contractAddress: this.contractAddress,
            contractName: this.contractName,
            functionName: 'play',
            functionArgs: [uintCV(spinValue)],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        };

        if (nonce !== undefined) txOptions.nonce = BigInt(nonce);
        if (fee !== undefined) txOptions.fee = BigInt(fee);

        return makeContractCall(txOptions);
    }

    /**
     * Helper function to get the full contract identifier
     * @returns {string} The fully qualified contract ID 
     */
    getContractIdentifier() {
        return `${this.contractAddress}.${this.contractName}`;
    }
}
