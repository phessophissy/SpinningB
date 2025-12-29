# Spinning Board Game

A decentralized spinning board game on the Stacks blockchain (Bitcoin L2).

## 🎮 Game Rules

- **Entry Fee:** 0.001 STX per spin
- **Players:** 2-10 per round
- **Spin Range:** Choose a number from 1 to 10
- **Winning:** Highest spin wins!
- **Prize:** 50% of pot to winner(s), 50% to game creator
- **Ties:** Winners split the prize equally

## 📁 Project Structure

```
SpinningB/
├── contracts/
│   └── spinning-board.clar    # Clarity smart contract
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── styles.css             # Styles
│   └── app.js                 # Frontend (REOWN AppKit + Stacks Connect)
├── scripts/
│   ├── deploy-contract.js     # Deployment script
│   └── play-game.js           # Test automation script
├── wallets.json               # Test wallets
├── package.json
└── README.md
```


## 🛠️ Setup

### 1. Get REOWN Project ID

1. Go to https://cloud.reown.com
2. Create a new project
3. Copy your Project ID
4. Update `frontend/app.js`:
   ```javascript
   const REOWN_PROJECT_ID = "your-project-id-here";
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Frontend Locally

```bash
# Using Python
cd frontend && python3 -m http.server 8080

# Or using Node.js
npx http-server frontend -p 8080
```

Then open http://localhost:8080

## 🌐 Deploy to GitHub Pages

1. Push to GitHub
2. Go to Settings > Pages
3. Set source to `main` branch, `/frontend` folder
4. Your game will be live at `https://yourusername.github.io/SpinningB/`

## 📜 Contract Functions

### Public Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `play` | `spin: uint (1-10)` | Join round and submit spin |

### Read-Only Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `get-current-round` | `uint` | Current round number |
| `get-player-count` | `uint` | Players in current round |
| `get-total-pot` | `uint` | Current pot in microSTX |
| `get-highest-spin` | `uint` | Highest spin this round |
| `has-player-played` | `bool` | Check if player joined |

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| u100 | Round already has 10 players |
| u101 | Spin must be 1-10 |
| u102 | STX transfer failed |
| u103 | Player already in this round |

## 🔧 Tech Stack

- **Smart Contract:** Clarity (Stacks)
- **Wallet Connection:** REOWN AppKit (transport) + Stacks Connect (signing)
- **Frontend:** Vanilla JS, HTML, CSS
- **Network:** Stacks Mainnet (Bitcoin L2)

## 📄 License

MIT
