## Build

From your project directory:

`docker build -t blog-api .`

## Run

### Production

#### Database:

`docker run -d --restart unless-stopped --name blog-db -p 5432:5432 -e POSTGRES_DB=blog -e POSTGRES_PASSWORD=mysecretpassword postgres`

#### Application:

`docker run -d --restart unless-stopped -p=8000:8000 -e PORT=8000 -e TOKEN_SECRET=secret -e DB_USER=user -e DB_HOST=host -e DB=blog -e DB_PASSWORD=password -e DB_PORT=5432 --name=blog-api blog-api`

### Development

#### Local:

<strong>db</strong>:

with data persistence:
`docker run -d --rm --name blog-db --mount type=volume,src=data,target=/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres` <br />

without data persistence:
`docker run -d --rm --name blog-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres` <br />

<strong>app</strong>:

`npm start`

#### Fully containerized 🚀:

`docker-compose rm -f` <br />
`docker-compose up --build -d` <br />
`docker exec -it blogapi_web_1 bash` <br />
`npm i` <br />
`npm run migration:up && npm start` <br />

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

## Endpoints

<strong>Auth</strong>:

`[POST]: https://mindaugaslazauskas.com/api/auth/signup` <br />
{
"email": string,
"password": string,
"fullname": string
}

`[POST]: https://mindaugaslazauskas.com/api/auth/signin` <br />
{
"email": string,
"password": string,
}

<strong>Posts</strong>:

`[GET]: https://mindaugaslazauskas.com/api/posts` <br />
`[GET]: https://mindaugaslazauskas.com/api/posts/{id}` <br />
`[POST]: https://mindaugaslazauskas.com/api/posts` <br />
{
"title": string
"body": string
}

`[PUT]: https://mindaugaslazauskas.com/api/posts/{id}` <br />
{
"title": string
"body": string
}

`[DELETE]: https://mindaugaslazauskas.com/api/posts/{id}`
