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

2. **Check prerequisites:**
   ```bash
   make check
   ```
   This verifies that Docker, docker-compose, and curl are installed.

3. **Build the Docker containers:**
   ```bash
   docker compose build
   ```
   
   Or use the Makefile:
   ```bash
   make build-docker
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

**Using Makefile (recommended):**
```bash
make build-docker   # Build and start containers
make start-docker   # Alias to build-docker
```

The application will be available at:
- **Web Interface**: http://127.0.0.1:3000
- **API**: http://127.0.0.1:3000/api
- **Swagger Docs**: http://127.0.0.1:3000/Swagger

**Stop the application:**
```bash
docker compose down
```

Or using Makefile:
```bash
make stop-docker
```

## Solve the CTF

DVAPI contains 10 challenges corresponding to the OWASP API Top 10 2023 vulnerabilities. Each challenge requires you to exploit a specific vulnerability to obtain an encrypted flag.

### Test User Credentials

A pre-configured test user is available for use across all CTF challenges:
- **Username**: `rnd`
- **Password**: `research`

This user can be used to login, submit flags, and test all challenges.

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

## Using Make Tools

DVAPI includes a Makefile with convenient commands for automation and testing:

### Quick Commands

```bash
make help           # Show all available make targets
make check         # Verify prerequisites (Docker, docker-compose, curl)
make build-docker  # Build and start Docker containers
make start-docker  # Alias to build-docker
make stop-docker   # Stop Docker containers
```

### Automated Exploitation

Run automated exploit scripts to test all 10 vulnerabilities:

```bash
make exploit
```

This will:
- Register a test user automatically
- Log in to get a JWT token
- Execute all 10 exploit scripts sequentially
- Save detailed logs to `logs/` directory
- Extract flags when found

Each exploit script tests a specific OWASP API Top 10 vulnerability using curl commands.

### Generate Reports

Create an HTML report from exploit results:

```bash
make report
```

The report includes:
- Summary statistics (success rate, flags captured)
- Detailed status for each challenge
- Flags found during exploitation
- Execution timestamps and notes

Reports are saved as `reports/exploit-report-YYYYMMDD-HHMMSS.html` and can be opened in any web browser.

### Cleanup

Remove generated logs and reports:

```bash
make clean
```

### Example Workflow

```bash
# 1. Check prerequisites
make check

# 2. Start DVAPI
make build-docker

# 3. Wait for services to be ready (about 10-15 seconds)

# 4. Run automated exploits
make exploit

# 5. Generate HTML report
make report

# 6. Open the report in your browser
# (path will be shown in terminal output)

# 7. When done, stop containers
make stop-docker
```
