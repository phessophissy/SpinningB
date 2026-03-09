# Spinning Board SDK

A simple and lightweight TypeScript/JavaScript SDK for interacting with the **Spinning Board Game** smart contract on the Stacks blockchain.

It acts as a wrapper around `@stacks/transactions` and `@stacks/network` specifically tailored to easily construct transactions for playing the Spinning Board game on the Stacks mainnet.

## Installation

```bash
npm install spinning-board-sdk
```

## Quick Start
You can quickly generate signing transactions for playing the game using our built-in wrapper class `SpinningBoardSDK`.

```javascript
import { SpinningBoardSDK } from 'spinning-board-sdk';
import { broadcastTransaction } from '@stacks/transactions';

async function playTheGame() {
  // 1. Initialize the SDK (defaults to mainnet)
  const sdk = new SpinningBoardSDK({ network: 'mainnet' });

  // 2. Build the game transaction
  // Spin value must be an integer between 1 and 10!
  const tx = await sdk.buildPlayTransaction({
    spinValue: 7,
    senderKey: 'YOUR_PRIVATE_KEY_HERE',
  });

  // 3. Broadcast it to the Stacks network
  const result = await broadcastTransaction(tx, sdk.network);
  
  if (result.error) {
    console.error('Failed to broadcast transaction:', result.error);
  } else {
    console.log('Transaction broadcasted successfully! TxID:', result.txid);
  }
}

playTheGame();
```

## Configuration Options

When initializing `SpinningBoardSDK(options)`, you can configure the environment:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `network` | `string` | `'mainnet'` | Set to `'mainnet'`, `'testnet'`, or `'mocknet'` |
| `coreApiUrl` | `string` | `undefined` | Custom URL for Stacks API node |
| `contractAddress` | `string` | `'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09'` | Stacks principal deploying the contract |
| `contractName` | `string` | `'spinning-board'` | Name of the contract on the chain |


## Contributing

Contributions are welcome! If you find a bug, missing feature, or simply want to improve this SDK wrapper, feel free to open a Pull Request.

## License
MIT
