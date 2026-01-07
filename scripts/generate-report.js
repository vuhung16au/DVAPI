#!/usr/bin/env node

/**
 * Generate HTML report from exploit results and API queries
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const REPORTS_DIR = process.argv[3] || path.join(__dirname, '..', 'reports');
const SCRIPTS_DIR = __dirname;
const LOGS_DIR = path.join(SCRIPTS_DIR, '..', 'logs');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '-');
const REPORT_FILE = path.join(REPORTS_DIR, `exploit-report-${TIMESTAMP}.html`);

// Challenge names mapping
const CHALLENGE_NAMES = {
    '0xa1': 'Broken Object Level Authorization',
    '0xa2': 'Broken Authentication',
    '0xa3': 'Broken Object Property Level Authorization',
    '0xa4': 'Unrestricted Resource Consumption',
    '0xa5': 'Broken Function Level Authorization',
    '0xa6': 'Unrestricted Access to Sensitive Business Flows',
    '0xa7': 'Server-Side Request Forgery',
    '0xa8': 'Security Misconfiguration',
    '0xa9': 'Improper Inventory Management',
    '0xaa': 'Unsafe Consumption of APIs',
};

// Function to extract flag from log file
function extractFlag(challengeId) {
    const flagFile = path.join(LOGS_DIR, `exploit-${challengeId}.log.flag`);
    if (fs.existsSync(flagFile)) {
        return fs.readFileSync(flagFile, 'utf8').trim();
    }
    
    const logFile = path.join(LOGS_DIR, `exploit-${challengeId}.log`);
    if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        const flagMatch = content.match(/flag\{[^}]+\}/i);
        return flagMatch ? flagMatch[0] : '';
    }
    return '';
}

// Function to check exploit status
function checkExploitStatus(challengeId) {
    const logFile = path.join(LOGS_DIR, `exploit-${challengeId}.log`);
    if (!fs.existsSync(logFile)) {
        return 'not_run';
    }
    
    const content = fs.readFileSync(logFile, 'utf8').toLowerCase();
    if (content.includes('flag found') || content.includes('✅') && content.includes('successful')) {
        return 'success';
    } else if (content.includes('❌') || content.includes('failed')) {
        return 'failed';
    } else {
        return 'partial';
    }
}

// Function to get notes from log file
function getNotes(challengeId) {
    const logFile = path.join(LOGS_DIR, `exploit-${challengeId}.log`);
    if (!fs.existsSync(logFile)) {
        return '';
    }
    
    const lines = fs.readFileSync(logFile, 'utf8').split('\n');
    const lastLines = lines.slice(-3).join('; ');
    return lastLines.length > 100 ? lastLines.substring(0, 100) + '...' : lastLines;
}

// Generate HTML report
function generateReport() {
    const challenges = ['0xa1', '0xa2', '0xa3', '0xa4', '0xa5', '0xa6', '0xa7', '0xa8', '0xa9', '0xaa'];
    
    // Calculate statistics
    let successCount = 0;
    let failCount = 0;
    let notRunCount = 0;
    let flagsFound = 0;
    
    const challengeData = challenges.map(challenge => {
        const status = checkExploitStatus(challenge);
        const flag = extractFlag(challenge);
        const notes = getNotes(challenge);
        
        if (status === 'success') successCount++;
        else if (status === 'failed') failCount++;
        else if (status === 'not_run') notRunCount++;
        
        if (flag) flagsFound++;
        
        return { challenge, status, flag, notes };
    });
    
    const totalChallenges = challenges.length;
    const successRate = totalChallenges > 0 ? Math.round((successCount * 100) / totalChallenges) : 0;
    
    // HTML template
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DVAPI Exploit Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #667eea;
        }
        .summary-card h3 {
            font-size: 2em;
            color: #667eea;
            margin-bottom: 5px;
        }
        .summary-card p {
            color: #666;
            font-size: 0.9em;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
        }
        th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .status-success {
            color: #28a745;
            font-weight: bold;
        }
        .status-failed {
            color: #dc3545;
            font-weight: bold;
        }
        .status-partial {
            color: #ffc107;
            font-weight: bold;
        }
        .status-not-run {
            color: #6c757d;
            font-weight: bold;
        }
        .flag {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.9em;
            color: #28a745;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #e0e0e0;
        }
        .api-stats {
            background: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .api-stats h3 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .api-stats p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ DVAPI Exploit Report</h1>
            <p>OWASP API Top 10 2023 Vulnerability Assessment</p>
        </div>
        <div class="content">
            <div class="summary">
                <div class="summary-card">
                    <h3>${totalChallenges}</h3>
                    <p>Total Challenges</p>
                </div>
                <div class="summary-card">
                    <h3>${successCount}</h3>
                    <p>Successful Exploits</p>
                </div>
                <div class="summary-card">
                    <h3>${flagsFound}</h3>
                    <p>Flags Captured</p>
                </div>
                <div class="summary-card">
                    <h3>${successRate}%</h3>
                    <p>Success Rate</p>
                </div>
            </div>
            
            <div class="api-stats">
                <h3>API Statistics</h3>
                <p><strong>DVAPI Status:</strong> Running at ${BASE_URL}</p>
                <p><em>Note: Full API statistics require authentication token</em></p>
            </div>
            
            <h2>Challenge Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Challenge</th>
                        <th>Vulnerability</th>
                        <th>Status</th>
                        <th>Flag</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    ${challengeData.map(ch => {
                        const statusHtml = {
                            'success': '<span class="status-success">✅ Success</span>',
                            'failed': '<span class="status-failed">❌ Failed</span>',
                            'partial': '<span class="status-partial">⚠️ Partial</span>',
                            'not_run': '<span class="status-not-run">⏸️ Not Run</span>',
                        }[ch.status] || '<span class="status-not-run">⏸️ Not Run</span>';
                        
                        const flagHtml = ch.flag 
                            ? `<span class="flag">${ch.flag}</span>`
                            : '<em>Not captured</em>';
                        
                        const notesHtml = ch.notes
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
                        
                        return `
                    <tr>
                        <td><strong>${ch.challenge}</strong></td>
                        <td>${CHALLENGE_NAMES[ch.challenge]}</td>
                        <td>${statusHtml}</td>
                        <td>${flagHtml}</td>
                        <td>${notesHtml}</td>
                    </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        <div class="footer">
            <p>Report generated on ${new Date().toLocaleString()}</p>
            <p>DVAPI - Damn Vulnerable API | OWASP API Top 10 2023</p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(REPORT_FILE, html);
    console.log(`✅ HTML report generated: ${REPORT_FILE}`);
    console.log(`   Open in browser: file://${path.resolve(REPORT_FILE)}`);
}

generateReport();
