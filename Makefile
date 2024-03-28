#!make

# ------------------------------------------------------------------------------
# Makefile -- Critterbase
# ------------------------------------------------------------------------------

-include .env

# Apply the contents of the .env to the terminal, so that the docker-compose file can use them in its builds
export $(shell sed 's/=.*//' .env)

## ------------------------------------------------------------------------------
## Alias Commands
## - Performs logical groups of commands for your convenience
## ------------------------------------------------------------------------------

# Running the docker build
# 1. Run `make env`
# 2. Edit the `.env` file as needed to update variables and secrets
# 3. Run `make backend`

postgres: | close build-postgres run-postgres ## Performs all commands necessary to run the postgres project (db) in docker
backend: | close build-backend run-backend ## Performs all commands necessary to run all backend projects (db, api) in docker
actions: | action-lint action-format action-deprecated action-build action-test ## Performs all commands necessary to run Github actions locally


## ------------------------------------------------------------------------------
## Setup/Cleanup Commands
## ------------------------------------------------------------------------------

env: ## Prepares the environment variables used by all project docker containers
	@echo "==============================================="
	@echo "Make: setup - copying env.docker to .env"
	@echo "==============================================="
	@cp -i ./.docker/env.docker .env

close: ## Closes all project containers
	@echo "==============================================="
	@echo "Make: close - closing Docker containers"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml down

clean: ## Closes and cleans (removes) all project containers
	@echo "==============================================="
	@echo "Make: clean - closing and cleaning Docker containers"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml down -v --rmi all --remove-orphans


## ------------------------------------------------------------------------------
## Build/Run Postgres DB Commands
## - Builds all of the Critterbase postgres db projects (db, db_setup)
## ------------------------------------------------------------------------------

build-postgres: ## Builds the postgres db containers
	@echo "==============================================="
	@echo "Make: build-postgres - building postgres db images"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml build db db_setup

run-postgres: ## Runs the postgres db containers
	@echo "==============================================="
	@echo "Make: run-postgres - running postgres db images"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml up -d db db_setup


## ------------------------------------------------------------------------------
## Build/Run Backend Commands
## - Builds all of the Critterbase backend projects (db, db_setup, api)
## ------------------------------------------------------------------------------

build-backend: ## Builds all backend containers
	@echo "==============================================="
	@echo "Make: build-backend - building backend images"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml build db db_setup api

run-backend: ## Runs all backend containers
	@echo "==============================================="
	@echo "Make: run-backend - running backend images"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml up -d db db_setup api


## ------------------------------------------------------------------------------
## Run Github Actions Locally
## ------------------------------------------------------------------------------

action-lint: ## Runs Github lint action
	@echo "==============================================="
	@echo "Make: action-lint - running Github lint action"
	@echo "==============================================="
	@npm run action:lint

action-format: ## Runs Github format action
	@echo "==============================================="
	@echo "Make: action-format - running Github format action"
	@echo "==============================================="
	@npm run action:format

action-deprecated: ## Runs Github deprecated action
	@echo "==============================================="
	@echo "Make: action-deprecated - running Github deprecated action"
	@echo "==============================================="
	@npm run action:deprecated

action-test: ## Runs Github test action
	@echo -n "\nRun test suite? [y/n] " && read ans && [ $${ans:-n} = y ]
	@echo "==============================================="
	@echo "Make: action-test - running Github test action"
	@echo "==============================================="
	@npm run test

