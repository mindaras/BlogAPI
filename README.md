## Build

From your project directory:

`docker build -t blog-api .`

## Run

### Fire up the database

`docker run -d --rm --name blog-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres`

### Fire up the project

`npm start`

or

`docker run -d --rm -p=8000:8000 --name=blog-api blog-api`

## Migrations

### Create

`npm run migration:create migrationname -- --sql-file`

### Run migrations that haven't been applied

`npm run migration:up`

### Revert last migration

`npm run migration:down`
