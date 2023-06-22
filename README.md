[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](Redirect-URL)

# Critterbase API

A brief description of what this project does and who it's for

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [API Endpoints](#api-endpoints)
3. [Environment Variables](#environment-variables)
4. [Run Locally](#run-locally)
5. [Running Tests](#running-tests)
6. [Authors](#authors)

## Tech Stack

**Server:** Node, Express, PM2, Typescript

**Database:** Postgres, Prisma

**Test Suite:** Jest, SuperTest

**Frameworks:** Zod

## API Endpoints

This API includes various modules, each with their own endpoints:

```
1.  Access:          /api/access/
2.  Artifact:        /api/artifacts/
3.  Bulk:            /api/bulk/
4.  Capture:         /api/captures/
5.  Collection Unit: /api/collection-units/
6.  Critter:         /api/critters/
7.  Family:          /api/family/
8.  Location:        /api/locations/
9.  Lookup:          /api/lookups/
10. Marking:         /api/markings/
11. Measurement:     /api/measurements/
12. Mortality:       /api/mortality/
13. User:            /api/users/
14. Xref:            /api/xref/
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`=`<number>`

`API_KEY`=`<uuid>`

`AUTHENTICATE`=`<'true' | 'false'>`

`DATABASE_URL`=`<prisma url string>`

## Run Locally

Clone the project

```bash
  git clone https://github.com/bcgov/critterbase-api
```

Go to the project directory

```bash
  cd critterbase-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```

Note: `npm run start` is used in the deployment pipeline to start the server and apply pending database migrations.

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Authors

- [@Graham Stewart (Developer)](https://github.com/GrahamS-Quartech)

- [@Jeremy Kissack (Developer)](https://github.com/JeremyQuartech)

- [@Mac Deluca (Developer)](https://github.com/MacQSL)
