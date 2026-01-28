# 🎰 Spinning Board Game

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://spinning-board.vercel.app/)
[![Stacks](https://img.shields.io/badge/blockchain-Stacks-5546FF)](https://www.stacks.co/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A decentralized spinning board game on the Stacks blockchain (Bitcoin L2).

![Ocean Spin Game Screenshot](https://via.placeholder.com/800x400/0a1929/20b2aa?text=🎰+Ocean+Spin+Game+Interface)

> **🌊 Live Demo:** [spinning-board.vercel.app](https://spinning-board.vercel.app/)

## 🎮 Game Rules

- **Entry Fee:** 0.001 STX per spin
- **Players:** 2-10 per round
- **Spin Range:** Choose a number from 1 to 10
- **Winning:** Highest spin wins!
- **Prize:** 50% of pot to winner(s), 50% to game creator
- **Ties:** Winners split the prize equally

## ✨ Features

- 🔐 Decentralized & trustless gameplay
- 💰 Automatic prize distribution via smart contract
- 🌊 Beautiful ocean-themed UI
- 📱 Mobile responsive design
- 🔗 REOWN AppKit wallet integration
- ⚡ Built on Stacks (Bitcoin L2)

## 📁 Project Structure

```
SpinningB/
├── contracts/
│   └── spinning-board.clar    # Clarity smart contract
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── styles.css             # Ocean theme styles
│   └── app.js                 # Frontend (REOWN AppKit + Stacks Connect)
├── package.json
├── vercel.json                # Vercel deployment config
├── CONTRIBUTING.md            # Contribution guidelines
└── README.md
```

## 🛠️ Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Clarinet](https://github.com/hirosystems/clarinet) (for contract development)
- A Stacks wallet (e.g., [Leather](https://leather.io/) or [Xverse](https://www.xverse.app/))

### 1. Clone the Repository

```bash
git clone https://github.com/phessophissy/SpinningB.git
cd SpinningB
```

### 2. Get REOWN Project ID

1. Go to https://cloud.reown.com
2. Create a new project
3. Copy your Project ID
4. Update `frontend/app.js`:
   ```javascript
   const REOWN_PROJECT_ID = "your-project-id-here";
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Frontend Locally

```bash
# Using Python
cd frontend && python3 -m http.server 8080

# Or using Node.js
npx http-server frontend -p 8080
```

Then open http://localhost:8080

## 🧪 Testnet Deployment

To deploy and test on Stacks Testnet before going to mainnet:

### 1. Install Clarinet

```bash
# macOS
brew install clarinet

# Windows
winget install hirosystems.clarinet

# Linux
curl -L https://github.com/hirosystems/clarinet/releases/download/v2.3.0/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/
```

### 2. Initialize Clarinet Project (if not exists)

```bash
clarinet new spinning-board-test
cd spinning-board-test
```

### 3. Copy Contract

```bash
cp ../contracts/spinning-board.clar contracts/
```

### 4. Update Clarinet.toml

Add to your `Clarinet.toml`:
```toml
[contracts.spinning-board]
path = "contracts/spinning-board.clar"
clarity_version = 2
epoch = 2.4
```

### 5. Test Locally

```bash
# Run unit tests
clarinet test

# Open interactive console
clarinet console
```

### 6. Deploy to Testnet

```bash
# Generate deployment plan
clarinet deployments generate --testnet

# Deploy
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### 7. Update Frontend for Testnet

In `frontend/app.js`, change:
```javascript
// For testnet testing
const NETWORK = new StacksTestnet();
const API_URL = "https://stacks-node-api.testnet.stacks.co";
const CONTRACT_ADDRESS = "YOUR_TESTNET_CONTRACT_ADDRESS";
```

### 8. Get Testnet STX

Get free testnet STX from the [Stacks Faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet).

## 🚀 Contract Deployment (Mainnet)

### Option 1: Using Clarinet

```bash
# Generate mainnet deployment plan
clarinet deployments generate --mainnet

# Review the plan, then deploy
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

### Option 2: Using Stacks Explorer

1. Go to [Stacks Explorer Sandbox](https://explorer.stacks.co/sandbox/deploy?chain=mainnet)
2. Connect your wallet
3. Paste the contract code from `contracts/spinning-board.clar`
4. Set contract name: `spinning-board`
5. Deploy and confirm the transaction

### Post-Deployment

After deploying, update `frontend/app.js`:
```javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const CONTRACT_NAME = "spinning-board";
```

## 🌐 Deploy Frontend

### GitHub Pages

1. Push to GitHub
2. Go to Settings > Pages
3. Set source to `main` branch, `/frontend` folder
4. Your game will be live at `https://yourusername.github.io/SpinningB/`

### Vercel (Recommended)

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Set the root directory to `frontend`
3. Deploy!

## 📜 Contract Functions

### Public Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `play` | `spin: uint (1-10)` | Join round and submit your spin |

### Read-Only Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `get-current-round` | `uint` | Current round number |
| `get-player-count` | `uint` | Players in current round (0-10) |
| `get-total-pot` | `uint` | Current pot in microSTX |
| `get-highest-spin` | `uint` | Highest spin this round |
| `has-player-played` | `bool` | Check if player already joined |
| `get-game-creator` | `principal` | Returns game creator address |
| `get-entry-fee` | `uint` | Returns entry fee (1000 microSTX) |
| `get-round-player` | `{player, spin}` | Get player info by index |

## ⚠️ Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| u100 | `ERR_ROUND_FULL` | Round already has 10 players |
| u101 | `ERR_INVALID_SPIN` | Spin must be between 1-10 |
| u102 | `ERR_PAYMENT_FAILED` | STX transfer failed |
| u103 | `ERR_ALREADY_PLAYED` | Player already in this round |
| u104 | `ERR_PAYOUT_FAILED` | Winner payout failed |
| u105 | `ERR_NO_WINNERS` | No winners found |

## 🔧 Tech Stack

- **Smart Contract:** [Clarity](https://docs.stacks.co/clarity) (Stacks)
- **Wallet Connection:** [REOWN AppKit](https://reown.com/) + [Stacks Connect](https://connect.stacks.js.org/)
- **Frontend:** Vanilla JS, HTML, CSS
- **Network:** [Stacks](https://www.stacks.co/) Mainnet (Bitcoin L2)
- **Hosting:** [Vercel](https://vercel.com/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Game:** [spinning-board.vercel.app](https://spinning-board.vercel.app/)
- **Contract on Explorer:** [View on Stacks Explorer](https://explorer.stacks.co/txid/SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09.spinning-board?chain=mainnet)
- **Stacks Blockchain:** [stacks.co](https://www.stacks.co/)

---

Built with 💙 on [Stacks](https://www.stacks.co/) | 🌊 Blue Sea Edition
