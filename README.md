# Storefront
it's a simple web API, its mini e-commerce app to show some products and create orders with an authentication & authorization system

**Please consider To look at Technical documentations:**
1. [API documentation](README.API-Doc.md)
1. [Database Schema](README.Database-Schema.md)

# Project Folder Structure
`/src/model` represent data access layer which contains data model with its specs(tests) files.


`/src/services` represent business layer which application services with its specs(tests) files.


`/src/routes` represent express route handlers which contains controllers.


`/src/tests` contains api end points tests using super tests.


for the other folders and files i hope that it's clear and self explanatory.
## Prerequisites
1. this application was developed on a machine with node v16 installed
1. yarn package manager is installed.
1. postgresql is installed and configured. 
1. please create a new database for this project then add it to the .env file as I'll explain below.
1. optionally install docker and docker-compose if you preferrer to [run this project with docker-compose](#compose). 

## How to run and install?
#### 1) clone this project then in the root folder run this command in terminal
```sh
yarn install
```
#### 2) create an .env file in the project root folder based on 
.env.example file, or you can easily rename .env.example to .env to get started, please don't forgot to set valid `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_HOST`

> Note that .env.example file is already embedded in project files

#### 3) migrate the database
```sh
yarn migrate
```

#### 4) build typescript files
```sh
yarn build
```

#### 5) start this app
```
yarn start
```

#### 6) running tests
```
yarn test
```
please note that by default the application will create new database with name `test_store_front_db` and run all tests on this database so if you want to change this database name 
1. update .env file and replace the value of `Test_DB_Name`
2. in package.json search for `test_store_front_db` then replace it with new name


### Other useful scripts
1. `yarn lint` to run eslint
1. `yarn lint:fix` to run eslint with fix mode
1. `yarn format` to run prettier
1. `yarn watch` to start the app with nodemon and typescript-watch for hot reload on changes

## <a name="compose"></a> Run this application with docker compose 
here is up command to start the app on port 4002 by default, also if you need you can change this behavior by modify docker-compose.yaml and change environment variables as you want.
```sh
docker-compose up --build
```
to clear created containers with networks , volumes related to this project please run this command
```sh
docker-compose down --volumes
```