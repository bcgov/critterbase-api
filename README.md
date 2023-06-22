[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](Redirect-URL)

# Critterbase API

Critterbase is a shared component of BiodiversityHubBC that manages information about individual animals, including capture and mortality events, measurements, markings, family relationships, and photos.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [API Endpoints](#api-endpoints)
3. [Environment Variables](#environment-variables)
4. [Run Locally](#run-locally)
5. [Running Tests](#running-tests)
6. [Authors](#authors)

## Tech Stack

**Server:** <br />
![NodeJS-18](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

**Database:** <br />
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

**Test Suite:** <br />
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

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

- [@Macgregor (Product Owner)]()

- [@Graham Stewart (Developer)](https://github.com/GrahamS-Quartech)

- [@Jeremy Kissack (Developer)](https://github.com/JeremyQuartech)

- [@Mac Deluca (Developer)](https://github.com/MacQSL)
