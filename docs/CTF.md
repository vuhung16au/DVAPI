# CTF Challenges

DVAPI contains 10 CTF challenges based on the OWASP API Top 10 2023 vulnerabilities. Each challenge requires exploiting a specific vulnerability to capture an encrypted flag.

## How It Works

1. **Exploit Vulnerabilities**: Identify and exploit the vulnerability in each challenge
2. **Capture Flags**: Successful exploits return encrypted flags
3. **Submit Flags**: Submit captured flags via `/api/flag/submit` endpoint
4. **Decrypt Flags**: Flags are encrypted using AES-256-CBC with a hardcoded key

## Flag Encryption

Flags are encrypted using **AES-256-CBC** with:
- **Key**: `c6a1d2f21b69f31b87e19348747d41fc` (hardcoded in `src/controllers/controllers.js`)
- **IV**: `0123456789abcdef0123456789abcdef` (hex)

When you submit a flag, it's encrypted server-side and compared against the encrypted flags stored in the database.

## The 10 Challenges

- **0xa1**: Broken Object Level Authorization - Access unauthorized user data
- **0xa2**: Broken Authentication - Bypass authentication or escalate privileges  
- **0xa3**: Broken Object Property Level Authorization - Manipulate object properties
- **0xa4**: Unrestricted Resource Consumption - Exploit resource limits
- **0xa5**: Broken Function Level Authorization - Access restricted functions
- **0xa6**: Unrestricted Access to Sensitive Business Flows - Abuse business logic
- **0xa7**: Server-Side Request Forgery - Make the server request internal resources
- **0xa8**: Security Misconfiguration - Find configuration errors
- **0xa9**: Improper Inventory Management - Access unreleased features
- **0xaa**: Unsafe Consumption of APIs - Exploit API input handling

## Flag Submission

Submit flags via POST to `/api/flag/submit`:
```json
{
  "challengeNo": 1,
  "flag": "flag{your_flag_here}"
}
```

## Tips

- Flags are typically found in API responses after successful exploitation
- Some flags may require decrypting encrypted data you discover
- Check error messages, stack traces, and API responses for clues
- Use the Swagger UI at `/Swagger` to explore endpoints
- See `docs/Top10-Vulns.md` for vulnerability details
- See `Solution/dvapi-solution.md` for step-by-step solutions
