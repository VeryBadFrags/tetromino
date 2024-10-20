# Makefile for Node.js project

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev     - Run in development mode"
	@echo "  make preview - Preview the production site"
	@echo "  make build   - Build the static site"
	@echo "  make lint    - Lint the code"
	@echo "  make format  - Format the code"
	@echo "  make clean   - Clean up project"
	@echo "  make help    - Display this help message"

.PHONY: dev
dev: 
	deno task dev

.PHONY: preview
preview: 
	deno task preview

.PHONY: build
build:
	deno task build

.PHONY: lint
lint:
	deno lint

.PHONY: format
format:
	deno fmt

.PHONY: clean
clean:
	rm -rf dist/
