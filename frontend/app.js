/**
 * Spinning Board Game - Frontend Application
 * Uses @stacks/connect for wallet connection and transaction signing
 * 
 * Stacks Mainnet
 */

import {
  openContractCall,
  showConnect,
  AppConfig,
  UserSession
} from "@stacks/connect";
import {
  uintCV,
  PostConditionMode
} from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";

// ============================================
// Configuration
// ============================================

const CONTRACT_ADDRESS = "SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09";
const CONTRACT_NAME = "spinning-board";
const NETWORK = new StacksMainnet();
const API_URL = "https://stacks-node-api.mainnet.stacks.co";

// ============================================
// State
// ============================================

let selectedSpin = null;
let connectedAddress = null;

// Initialize Stacks UserSession
const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

// ============================================
// DOM Elements
// ============================================

const connectBtn = document.getElementById("connectBtn");
const playBtn = document.getElementById("playBtn");
const playBtnText = document.getElementById("playBtnText");
const statusMessage = document.getElementById("statusMessage");
const txHistory = document.getElementById("txHistory");
const txLink = document.getElementById("txLink");
const spinButtons = document.querySelectorAll(".spin-btn");
const walletInfo = document.getElementById("walletInfo");
const walletAddress = document.getElementById("walletAddress");

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
  connectBtn.addEventListener("click", connectWallet);
  playBtn.addEventListener("click", playGame);

  // Spin button selection
  spinButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectSpin(btn));
  });

  // Check if wallet already connected
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    connectedAddress = userData.profile.stxAddress.mainnet;
    updateUIForConnectedWallet();
    checkIfAlreadyPlayed();
  }

  // Load game stats
  loadGameStats();

  // Refresh stats every 30 seconds
  setInterval(loadGameStats, 30000);
}

// ============================================
// Wallet Connection
// ============================================

function connectWallet() {
  showConnect({
    appDetails: {
      name: "SpinningB - Maroon Stripe",
      icon: "https://stacks.co/favicon.ico",
    },
    onFinish: () => {
      const userData = userSession.loadUserData();
      connectedAddress = userData.profile.stxAddress.mainnet;
      updateUIForConnectedWallet();
      checkIfAlreadyPlayed();
    },
    onCancel: () => {
      showStatus("Wallet connection cancelled", "info");
    },
    userSession,
  });
}

function disconnectWallet() {
  userSession.signUserOut();
  connectedAddress = null;
  updateUIForDisconnectedWallet();
}

function updateUIForConnectedWallet() {
  // Update connect button
  connectBtn.textContent = "Disconnect";
  connectBtn.classList.add("connected");
  connectBtn.onclick = disconnectWallet;

  // Show wallet info
  if (walletInfo) {
    walletInfo.classList.remove("hidden");
    if (walletAddress) {
      walletAddress.textContent = `${connectedAddress.slice(0, 8)}...${connectedAddress.slice(-4)}`;
    }
  }

  // Update play button
  if (selectedSpin) {
    playBtn.disabled = false;
    playBtnText.textContent = `Spin ${selectedSpin} - Pay 0.001 STX`;
  } else {
    playBtnText.textContent = "Select a Number";
  }
}

function updateUIForDisconnectedWallet() {
  // Update connect button
  connectBtn.textContent = "Connect Wallet";
  connectBtn.classList.remove("connected");
  connectBtn.onclick = connectWallet;

  // Hide wallet info
  if (walletInfo) {
    walletInfo.classList.add("hidden");
  }

  // Update play button
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
