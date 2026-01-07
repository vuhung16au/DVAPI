# OWASP API Top 10 2023 Vulnerabilities

## How and Where the Vulnerabilities are Implemented

This section provides a brief overview of how each of the OWASP API Top 10 2023 vulnerabilities is implemented in DVAPI and where they can be found in the codebase.

### 0xa1: Broken Object Level Authorization

**Location**: `/api/getNote` endpoint  
**Implementation**: The `getNote` function in `src/controllers/controllers.js` (lines 123-135) retrieves notes based on a username parameter from the query string without verifying that the requesting user has authorization to access that user's notes. An attacker can access any user's secret notes by simply changing the `username` parameter in the request.

**Vulnerable Code**: The endpoint accepts `req.query.username` and directly queries the database without checking if the authenticated user matches the requested username.

### 0xa2: Broken Authentication

**Location**: JWT authentication system  
**Implementation**: The JWT secret is hardcoded as `'secret123'` in `src/controllers/auth.js` (line 7), making it vulnerable to brute-force attacks. Additionally, the admin check is performed by reading the `isAdmin` field directly from the JWT token (line 87), which can be manipulated if the weak secret is compromised.

**Vulnerable Code**: Weak JWT secret allows attackers to forge tokens, and the admin status is determined solely by the `isAdmin` field in the JWT payload.

### 0xa3: Broken Object Property Level Authorization

**Location**: `/api/register` endpoint  
**Implementation**: The registration function in `src/controllers/auth.js` (lines 10-29) accepts the entire request body and saves it directly to the database without proper validation or sanitization. This allows users to set arbitrary properties like `score` during registration, bypassing intended business logic.

**Vulnerable Code**: The registration endpoint uses `new User(adduser)` where `adduser = req.body`, allowing clients to set any user properties including sensitive fields like score.

### 0xa4: Unrestricted Resource Consumption

**Location**: Profile image upload functionality  
**Implementation**: The profile image upload handler in `src/controllers/controllers.js` (lines 137-286) does not enforce file size limits. While there are some size checks for flag generation, there are no actual restrictions preventing users from uploading extremely large files, which could lead to resource exhaustion.

**Vulnerable Code**: The upload handler processes files without implementing proper size restrictions, allowing potential denial of service attacks through resource consumption.

### 0xa5: Broken Function Level Authorization

**Location**: `/api/user/:username` DELETE endpoint  
**Implementation**: The `deleteUser` function in `src/controllers/controllers.js` (lines 542-557) is accessible to all authenticated users. While it prevents deletion of the `admin` account, regular users can delete other users' accounts without proper authorization checks.

**Vulnerable Code**: The DELETE endpoint only checks if the target username is 'admin' but does not verify that the requesting user has permission to delete the specified user account.

### 0xa6: Unrestricted Access to Sensitive Business Flows

**Location**: `/api/submitTicket` endpoint  
**Implementation**: The ticket submission endpoint in `src/controllers/controllers.js` (lines 339-361) lacks rate limiting. The `checkTicket` function only rejects after 150 tickets, but the flag is returned when the promise is rejected (around 96 tickets in practice), allowing attackers to automate ticket submissions to trigger the sensitive business flow.

**Vulnerable Code**: No rate limiting is implemented on the ticket submission endpoint, enabling automated exploitation of the sensitive business flow.

### 0xa7: Server-Side Request Forgery (SSRF)

**Location**: `/api/addNoteWithLink` endpoint  
**Implementation**: The `addNoteWithLink` function in `src/controllers/controllers.js` (lines 457-485) accepts a URL from the request body and makes an unvalidated HTTP request to that URL using the `request` library. This allows attackers to make requests to internal services, including an internal server running on port 8443.

**Vulnerable Code**: The endpoint uses `request(url, ...)` without validating or sanitizing the URL parameter, enabling SSRF attacks against internal infrastructure.

### 0xa8: Security Misconfiguration

**Location**: Error handling in authentication middleware  
**Implementation**: The `verifyToken` function in `src/controllers/auth.js` (lines 66-108) exposes detailed error information including stack traces in error responses (line 106). This information disclosure can aid attackers in understanding the application structure and identifying additional vulnerabilities.

**Vulnerable Code**: Error responses include `err.stack` which exposes internal application details and stack traces to clients.

### 0xa9: Improper Inventory Management

**Location**: `/api/allChallenges` endpoint  
**Implementation**: The `allChallenges` function in `src/controllers/controllers.js` (lines 511-541) exposes unreleased challenges when the `unreleased` parameter is set to `1`. These challenges should not be accessible in production but are exposed due to improper API inventory management.

**Vulnerable Code**: The endpoint returns unreleased challenges when `unreleased === 1`, exposing features that should not be publicly available.

### 0xaa: Unsafe Consumption of APIs

**Location**: `/api/login` endpoint  
**Implementation**: The login function in `src/controllers/auth.js` (lines 32-63) performs a database query using direct object comparison without proper input sanitization (line 36). This makes it vulnerable to NoSQL injection attacks, where attackers can bypass authentication by using MongoDB query operators like `{"$ne": null}`.

**Vulnerable Code**: The login endpoint uses `User.findOne({ username: username, password: password })` without sanitizing user input, allowing NoSQL injection payloads to bypass authentication checks.
