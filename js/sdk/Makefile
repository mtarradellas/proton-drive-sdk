SHELL := /bin/bash

.PHONY: help
help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: ## Builds sdk
	npm run build

.PHONY: check-types
check-types: ## Check types
	npm run check-types

.PHONY: generate-doc-interface
generate-doc-interface: ## Check types
	npm run generate-doc:interface

.PHONY: generate-types
generate-types: ## Check types
	npm run generate-types
