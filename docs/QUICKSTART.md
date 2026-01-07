# DVAPI Quick Start Guide

## Overview

DVAPI (Damn Vulnerable API) is an intentionally vulnerable web application designed to teach API security through hands-on practice. It implements the OWASP API Top 10 2023 vulnerabilities as CTF challenges. Your goal is to identify and exploit these vulnerabilities to capture flags.

The application provides:
- Web interface at `http://127.0.0.1:3000`
- RESTful API endpoints
- Swagger documentation at `/Swagger`
- Postman collection for API testing

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (for cloning)
- Optional: [Postman](https://www.postman.com/) or similar API testing tool

## Build

1. **Clone the repository:**
   ```bash
   git clone https://github.com/payatu/DVAPI.git
   cd DVAPI
   ```

2. **Build the Docker containers:**
   ```bash
   docker compose build
   ```

   This will:
   - Build the Node.js application container
   - Pull the MongoDB image
   - Install all dependencies

## Run

**Start the application:**
```bash
docker compose up
```

Or to build and run in one command:
```bash
docker compose up --build
```

The application will be available at:
- **Web Interface**: http://127.0.0.1:3000
- **API**: http://127.0.0.1:3000/api
- **Swagger Docs**: http://127.0.0.1:3000/Swagger

**Stop the application:**
```bash
docker compose down
```

## Solve the CTF

DVAPI contains 10 challenges corresponding to the OWASP API Top 10 2023 vulnerabilities. Each challenge requires you to exploit a specific vulnerability to obtain an encrypted flag.

### General Approach

1. **Register/Login**: Create an account or log in to get a JWT authentication token
2. **Explore**: Use the web interface, Swagger docs, or Postman to explore available endpoints
3. **Identify Vulnerabilities**: Look for common API security issues:
   - Authorization bypasses
   - Authentication weaknesses
   - Input validation flaws
   - Unrestricted resource access
4. **Exploit**: Craft requests to exploit the identified vulnerabilities
5. **Capture Flags**: Each successful exploit returns an encrypted flag

### The 10 Challenges

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

### Tips

- **Use Postman**: Import the Postman collection from `src/swagger/DVAPI.postman_collection.json`
- **Check Swagger**: Visit `/Swagger` for interactive API documentation
- **Inspect Responses**: Error messages and stack traces may reveal useful information
- **Try Different HTTP Methods**: Some endpoints may support OPTIONS, DELETE, etc.
- **Modify Parameters**: Change usernames, IDs, or other parameters to test authorization
- **Review JWT Tokens**: Decode and analyze JWT tokens at [jwt.io](https://jwt.io)

### Flag Format

Flags are encrypted using AES-256-CBC with a hardcoded key. After capturing encrypted flags, you'll need to decrypt them to complete the challenges.

### Getting Help

- See `docs/Top10-Vulns.md` for detailed vulnerability information
- See `Solution/dvapi-solution.md` for step-by-step solutions
- Check `docs/TechStacks.md` for technology details

**⚠️ Warning**: This application is intentionally vulnerable. Never deploy it in a production environment!
