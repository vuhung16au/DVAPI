.PHONY: help check build-docker start-docker stop-docker exploit report clean

# Default target
.DEFAULT_GOAL := help

# Variables
BASE_URL ?= http://localhost:3000
SCRIPTS_DIR := scripts
EXPLOITS_DIR := $(SCRIPTS_DIR)/exploits
LOGS_DIR := logs
REPORTS_DIR := reports

help: ## Display this help message
	@echo "DVAPI Makefile - Available targets:"
	@echo ""
	@echo "  make help          - Display this help message"
	@echo "  make check         - Check if prerequisites are met"
	@echo "  make build-docker  - Build Docker images and start containers"
	@echo "  make start-docker  - Alias to build-docker (build and start containers)"
	@echo "  make stop-docker   - Stop Docker containers"
	@echo "  make exploit       - Run automated exploit scripts using Node.js"
	@echo "  make report        - Generate HTML report from exploit results"
	@echo "  make clean         - Clean logs and reports directories"
	@echo ""
	@echo "Variables:"
	@echo "  BASE_URL           - DVAPI base URL (default: http://localhost:3000)"

check: ## Check if prerequisites are met
	@echo "Checking prerequisites..."
	@echo ""
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker is not installed"; exit 1; }
	@echo "✅ Docker is installed"
	@command -v docker-compose >/dev/null 2>&1 || docker compose version >/dev/null 2>&1 || { echo "❌ docker-compose is not installed"; exit 1; }
	@echo "✅ docker-compose is available"
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js is not installed"; exit 1; }
	@echo "✅ Node.js is installed"
	@node -e "process.exit(parseInt(process.version.slice(1)) >= 18 ? 0 : 1)" 2>/dev/null || { echo "⚠️  Node.js 18+ required for built-in fetch support"; exit 1; }
	@echo "✅ Node.js version supports fetch API"
	@echo ""
	@echo "Checking if DVAPI is running..."
	@curl -s -o /dev/null -w "%{http_code}" $(BASE_URL) 2>/dev/null | grep -q "200\|301\|302" && echo "✅ DVAPI is accessible at $(BASE_URL)" || echo "⚠️  DVAPI may not be running at $(BASE_URL)"
	@echo ""
	@echo "All prerequisites check passed!"

build-docker: ## Build Docker images and start containers
	@echo "Building Docker images and starting containers..."
	docker compose up --build -d
	@echo ""
	@echo "Waiting for services to be ready..."
	@sleep 5
	@echo "✅ Docker containers are running"
	@echo "DVAPI should be available at $(BASE_URL)"

start-docker: build-docker ## Alias to build-docker (build and start containers)

stop-docker: ## Stop Docker containers
	@echo "Stopping Docker containers..."
	@docker compose down
	@echo "✅ Docker containers stopped"

exploit: ## Run automated exploit scripts using Node.js
	@echo "Starting automated exploit execution..."
	@mkdir -p $(LOGS_DIR)
	@node $(SCRIPTS_DIR)/exploit.js $(BASE_URL)
	@echo ""
	@echo "✅ Exploit execution completed. Check $(LOGS_DIR)/ for logs."

report: ## Generate HTML report from exploit results
	@echo "Generating HTML report..."
	@mkdir -p $(REPORTS_DIR)
	@node $(SCRIPTS_DIR)/generate-report.js $(BASE_URL) $(REPORTS_DIR)
	@echo ""
	@echo "✅ Report generated. Check $(REPORTS_DIR)/ for the HTML report."

clean: ## Clean logs and reports directories
	@echo "Cleaning logs and reports..."
	@rm -rf $(LOGS_DIR)/*.log
	@rm -rf $(REPORTS_DIR)/*.html
	@echo "✅ Clean completed"
