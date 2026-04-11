/**
 * Script helper: feature-multiplayer-mode-2
 * Utility for: Add multiplayer mode foundation
 */

const SCRIPT_VERSION = '2.0.0';

function validateInput2(params) {
  const required = ['address', 'amount'];
  const missing = required.filter(k => !(k in params));
  if (missing.length > 0) {
    throw new Error(`Missing required params: ${missing.join(', ')}`);
  }
  return true;
}

function formatOutput2(data) {
  return {
    version: SCRIPT_VERSION,
    timestamp: new Date().toISOString(),
    results: Array.isArray(data) ? data : [data],
    count: Array.isArray(data) ? data.length : 1,
  };
}

module.exports = { validateInput2, formatOutput2, SCRIPT_VERSION };
