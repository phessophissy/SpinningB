/**
 * Script helper: improvement-event-indexer-7
 * Utility for: Event indexer for game history
 */

const SCRIPT_VERSION = '7.0.0';

function validateInput7(params) {
  const required = ['address', 'amount'];
  const missing = required.filter(k => !(k in params));
  if (missing.length > 0) {
    throw new Error(`Missing required params: ${missing.join(', ')}`);
  }
  return true;
}

function formatOutput7(data) {
  return {
    version: SCRIPT_VERSION,
    timestamp: new Date().toISOString(),
    results: Array.isArray(data) ? data : [data],
    count: Array.isArray(data) ? data.length : 1,
  };
}

module.exports = { validateInput7, formatOutput7, SCRIPT_VERSION };
