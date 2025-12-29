/**
 * Spinning Board Game - Frontend Application
 * Uses REOWN AppKit as transport layer for wallet connection
 * Uses @stacks/connect for Stacks transaction signing
 * 
 * Stacks Mainnet
 */

import { createAppKit } from "https://cdn.jsdelivr.net/npm/@reown/appkit@latest/+esm";
import { StacksMainnet } from "https://cdn.jsdelivr.net/npm/@stacks/network@6.13.0/+esm";
import { 
  openContractCall, 
  showConnect,
  AppConfig,
  UserSession 
} from "https://cdn.jsdelivr.net/npm/@stacks/connect@7.7.1/+esm";
import { 
  uintCV, 
  PostConditionMode 
} from "https://cdn.jsdelivr.net/npm/@stacks/transactions@6.13.0/+esm";

// ============================================
// Configuration
// ============================================

const CONTRACT_ADDRESS = "SP31G2FZ5JN87BATZMP4ZRYE5F7WZQDNEXJ7G7X97";
const CONTRACT_NAME = "spinning-board";
const NETWORK = new StacksMainnet();
const API_URL = "https://stacks-node-api.mainnet.stacks.co";

// REOWN Project ID
const REOWN_PROJECT_ID = "aeba2209111bfd0d139b63ee8ecc7e0a";

// ============================================
// State
// ============================================

let selectedSpin = null;
let connectedAddress = null;
let userSession = null;

// ============================================
// Initialize REOWN AppKit
// ============================================

// Stacks network configuration for REOWN
const stacksMainnet = {
  id: "stacks:1",
  name: "Stacks Mainnet",
  nativeCurrency: {
    name: "Stacks",
    symbol: "STX",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://stacks-node-api.mainnet.stacks.co"],
    },
  },
  blockExplorers: {
    default: {
      name: "Stacks Explorer",
      url: "https://explorer.stacks.co",
    },
  },
};

// Initialize AppKit
const appKit = createAppKit({
  projectId: REOWN_PROJECT_ID,
  networks: [stacksMainnet],
  metadata: {
    name: "Spinning Board Game",
    description: "A decentralized spinning board game on Stacks",
    url: window.location.origin,
    icons: ["https://stacks.co/favicon.ico"],
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#6366f1",
    "--w3m-border-radius-master": "12px",
  },
});

// Initialize Stacks UserSession for transaction signing
const appConfig = new AppConfig(["store_write"]);
userSession = new UserSession({ appConfig });

// ============================================
// DOM Elements
// ============================================

const playBtn = document.getElementById("playBtn");
const playBtnText = document.getElementById("playBtnText");
const statusMessage = document.getElementById("statusMessage");
const txHistory = document.getElementById("txHistory");
const txLink = document.getElementById("txLink");
const spinButtons = document.querySelectorAll(".spin-btn");

// Stat elements
const currentRoundEl = document.getElementById("currentRound");
const playerCountEl = document.getElementById("playerCount");
const totalPotEl = document.getElementById("totalPot");
const highestSpinEl = document.getElementById("highestSpin");

// ============================================
// Initialize App
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Setup event listeners
  playBtn.addEventListener("click", playGame);

  // Spin button selection
  spinButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectSpin(btn));
  });

  // Listen for REOWN connection state changes
  appKit.subscribeState((state) => {
    console.log("AppKit state:", state);
    if (state.selectedNetworkId && state.address) {
      onWalletConnected(state.address);
    } else {
      onWalletDisconnected();
    }
  });

  // Check if Stacks wallet already connected
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    connectedAddress = userData.profile.stxAddress.mainnet;
    updateUIForConnectedWallet();
  }

  // Load game stats
  loadGameStats();

  // Refresh stats every 30 seconds
  setInterval(loadGameStats, 30000);
}

// ============================================
// Wallet Connection (REOWN as transport, Stacks Connect for signing)
// ============================================

function onWalletConnected(address) {
  console.log("Wallet connected via REOWN:", address);
  
  // REOWN connected - now connect Stacks wallet for signing
  if (!userSession.isUserSignedIn()) {
    // Prompt Stacks wallet connection for transaction signing
    showConnect({
      appDetails: {
        name: "Spinning Board Game",
        icon: "https://stacks.co/favicon.ico",
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        connectedAddress = userData.profile.stxAddress.mainnet;
        updateUIForConnectedWallet();
        checkIfAlreadyPlayed();
      },
      userSession,
    });
  } else {
    const userData = userSession.loadUserData();
    connectedAddress = userData.profile.stxAddress.mainnet;
    updateUIForConnectedWallet();
    checkIfAlreadyPlayed();
  }
}

function onWalletDisconnected() {
  console.log("Wallet disconnected");
  connectedAddress = null;
  userSession.signUserOut();
  updateUIForDisconnectedWallet();
}

function updateUIForConnectedWallet() {
  if (selectedSpin) {
    playBtn.disabled = false;
    playBtnText.textContent = `Spin ${selectedSpin} - Pay 0.001 STX`;
  } else {
    playBtnText.textContent = "Select a Number";
  }
}

function updateUIForDisconnectedWallet() {
  playBtn.disabled = true;
  playBtnText.textContent = "Connect Wallet to Play";
}

// ============================================
// Game Stats
// ============================================

async function loadGameStats() {
  try {
    const [round, players, pot, highest] = await Promise.all([
      callReadOnly("get-current-round"),
      callReadOnly("get-player-count"),
      callReadOnly("get-total-pot"),
      callReadOnly("get-highest-spin"),
    ]);

    currentRoundEl.textContent = round;
    playerCountEl.textContent = `${players}/10`;
    totalPotEl.textContent = `${(pot / 1000000).toFixed(4)} STX`;
    highestSpinEl.textContent = highest > 0 ? highest : "-";
  } catch (error) {
    console.error("Failed to load game stats:", error);
  }
}

async function callReadOnly(functionName, args = []) {
  const url = `${API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: CONTRACT_ADDRESS,
      arguments: args,
    }),
  });

  const data = await response.json();

  if (!data.okay) {
    throw new Error(data.cause || "Contract call failed");
  }

  return parseClarityValue(data.result);
}

function parseClarityValue(hex) {
  // Simple parser for uint values
  if (hex.startsWith("0x01")) {
    const valueHex = hex.slice(4);
    return parseInt(valueHex, 16);
  }
  if (hex === "0x03") return true;
  if (hex === "0x04") return false;
  return hex;
}

// ============================================
// Game Actions
// ============================================

function selectSpin(btn) {
  spinButtons.forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedSpin = parseInt(btn.dataset.spin);

  if (connectedAddress) {
    playBtn.disabled = false;
    playBtnText.textContent = `Spin ${selectedSpin} - Pay 0.001 STX`;
  }
}

async function checkIfAlreadyPlayed() {
  if (!connectedAddress) return;

  try {
    // Encode principal for API call
    const url = `${API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/has-player-played`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: connectedAddress,
        arguments: [`0x0516${stringToHex(connectedAddress)}`],
      }),
    });

    const data = await response.json();
    const hasPlayed = data.result === "0x03";

    if (hasPlayed) {
      showStatus("You already played this round. Wait for it to complete!", "info");
      playBtn.disabled = true;
      playBtnText.textContent = "Already Played This Round";
    }
  } catch (error) {
    console.error("Failed to check play status:", error);
  }
}

function stringToHex(str) {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hex;
}

async function playGame() {
  if (!connectedAddress || !selectedSpin) {
    showStatus("Please connect wallet and select a spin number", "error");
    return;
  }

  // Disable button and show loading
  playBtn.disabled = true;
  playBtnText.textContent = "Submitting Transaction...";
  playBtn.classList.add("loading");
  hideStatus();

  try {
    // Use Stacks Connect for transaction signing
    await openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "play",
      functionArgs: [uintCV(selectedSpin)],
      network: NETWORK,
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log("Transaction submitted:", data);
        showStatus(`Transaction submitted! Spin: ${selectedSpin}`, "success");

        txHistory.classList.remove("hidden");
        txLink.href = `https://explorer.stacks.co/txid/${data.txId}?chain=mainnet`;
        txLink.textContent = `${data.txId.slice(0, 20)}...`;

        playBtn.classList.remove("loading");
        playBtnText.textContent = "Transaction Pending...";

        setTimeout(loadGameStats, 5000);
        setTimeout(() => {
          checkIfAlreadyPlayed();
          loadGameStats();
        }, 15000);
      },
      onCancel: () => {
        showStatus("Transaction cancelled", "info");
        resetPlayButton();
      },
    });
  } catch (error) {
    console.error("Transaction error:", error);
    showStatus(`Error: ${error.message}`, "error");
    resetPlayButton();
  }
}

function resetPlayButton() {
  playBtn.classList.remove("loading");
  playBtn.disabled = false;
  if (selectedSpin) {
    playBtnText.textContent = `Spin ${selectedSpin} - Pay 0.001 STX`;
  } else {
    playBtnText.textContent = "Select a Number";
  }
}

// ============================================
// UI Helpers
// ============================================

function showStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.classList.remove("hidden");
}

function hideStatus() {
  statusMessage.classList.add("hidden");
}
