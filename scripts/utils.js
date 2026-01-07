/**
 * Common utilities for exploit scripts
 */

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Logging utility
 */
function createLogger(challengeId) {
    const logFile = path.join(LOGS_DIR, `exploit-${challengeId}.log`);
    const flagFile = path.join(LOGS_DIR, `exploit-${challengeId}.log.flag`);

    function log(message) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage);
        fs.appendFileSync(logFile, logMessage + '\n');
    }

    function saveFlag(flag) {
        if (flag) {
            fs.writeFileSync(flagFile, flag);
            log(`✅ FLAG FOUND: ${flag}`);
        }
    }

    return { log, saveFlag, logFile };
}

/**
 * HTTP request utility
 */
async function httpRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
        return { status: response.status, data, text, ok: response.ok };
    } catch (error) {
        return { error: error.message, ok: false };
    }
}

/**
 * Extract flag from response
 */
function extractFlag(text) {
    const flagMatch = text.match(/flag\{[^}]+\}/i);
    return flagMatch ? flagMatch[0] : null;
}

module.exports = {
    createLogger,
    httpRequest,
    extractFlag,
    LOGS_DIR,
};
