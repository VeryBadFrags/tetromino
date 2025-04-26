# Makefile for Node.js project

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev     - Run in development mode"
	@echo "  make build   - Build the static site"
	@echo "  make format  - Format the code"
	@echo "  make lint    - Lint the code"
	@echo "  make clean   - Clean up project"
	@echo "  make help    - Display this help message"

.PHONY: dev
dev: 
	pnpm run dev

.PHONY: build
build:
	pnpm run build

.PHONY: format
format:
	pnpm run format

.PHONY: lint
lint:
	pnpm run lint

.PHONY: clean
clean:
	rm -rf dist/
