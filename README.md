## Build

From your project directory:

`docker build -t blog-api .`

## Run

### Production

_Application_:
`docker run -d --rm -p=8000:8000 --name=blog-api blog-api`

_Database_:
`docker run -d --rm --name blog-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres`

### Development

_Local_:
`docker run -d --rm --name blog-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres`
`npm start`

🚀 _Fully containerized_ 🚀:
`docker-compose rm -f`
`docker-compose up --build -d`
`docker exec -it blogapi_web_1 bash`
`npm i`
`npm run migration:up && npm start`

To stop: `docker-compose stop`

Code in your local environment and container will pickup the changes.

Note: make npm installations in container environment since some dependencies are compiled differently on different OS.

## Migrations

### Create

`npm run migration:create migrationname -- --sql-file`

### Run migrations that haven't been applied yet

`npm run migration:up`

### Revert last migration

`npm run migration:down`
