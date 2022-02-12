## Build

From your project directory:

`docker build -t blog-api .`

## Run

### Production

#### Database:

`docker run -d --restart unless-stopped --name blog-db --mount type=volume,src=data,target=/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_DB=blog -e POSTGRES_PASSWORD=mysecretpassword postgres`

#### Cache:

`mkdir cacheVolume` <br />
`docker run -d --restart unless-stopped --mount type=volume,src=cacheVolume,target=/data -p 6379:6379 --name blog-redis redis redis-server --requirepass mysecretpassword --save 60 1 --loglevel warning`

#### Application:

`docker run -d --restart unless-stopped -p=8000:8000 -e PORT=8000 -e TOKEN_SECRET=secret -e DB_USER=user -e DB_HOST=host -e DB=blog -e DB_PASSWORD=mysecretpassword -e DB_PORT=5432 AWS_ACCESS_KEY_ID=ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=SECRET_ACCESS_KEY AWS_BUCKET_NAME=blog-avatars AWS_REGION=eu-central-1 NODE_ENV=production --name=blog-api blog-api`

### Development

#### Local:

<strong>db</strong>:

With data persistence:
`docker run -d --rm --name blog-db --mount type=volume,src=data,target=/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_DB=blog -e POSTGRES_PASSWORD=mysecretpassword postgres`

Without data persistence:
`docker run -d --rm --name blog-db -p 5432:5432 -e POSTGRES_DB=blog -e POSTGRES_PASSWORD=mysecretpassword postgres`

<strong>redis</strong>

`docker run --rm -d -p 6379:6379 --name blog-redis redis --requirepass mysecretpassword`

<strong>app</strong>:

`npm start`

#### Fully containerized 🚀:

`docker-compose up --build -d` <br />
`docker exec -it blogapi_web_1 bash` <br />
`npm i` <br />
`npm run migration:up && npm start`

To stop: `docker-compose stop && docker-compose rm -f`

Code in your local environment and container will pickup the changes.

Note: make npm installations in the container environment since some dependencies are compiled differently on different OS.

## Migrations

### Createg

`npm run migration:create migrationname -- --sql-file`

### Run migrations that haven't been applied yet

`npm run migration:up`

### Revert last migration

`npm run migration:down`

## Testing

Startup the database: `docker run -d --rm --name blog-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres`

Run: `npm test`

## Endpoints

<strong>Auth</strong>:

`[POST]: https://mindaugaslazauskas.com/api/auth/signup`
{
"email": string,
"password": string,
"fullname": string
}

`[POST]: https://mindaugaslazauskas.com/api/auth/signin`
{
"email": string,
"password": string,
}

<strong>Posts</strong>:

`[GET]: https://mindaugaslazauskas.com/api/posts` <br />
`[GET]: https://mindaugaslazauskas.com/api/posts/{id}` <br />
`[POST]: https://mindaugaslazauskas.com/api/posts`
{
"title": string
"body": string
}

`[PUT]: https://mindaugaslazauskas.com/api/posts/{id}`
{
"title": string
"body": string
}

`[PUT]: https://mindaugaslazauskas.com/api/posts/{id}/status`
{
"status": "DRAFT" | "PUBLISHED"
}

`[DELETE]: https://mindaugaslazauskas.com/api/posts/{id}`

<strong>Users</strong>:

`[GET]: https://mindaugaslazauskas.com/api/users`
`[POST]: https://mindaugaslazauskas.com/api/users/avatar-upload`
Encoding: multipart/form-data
{
"file": File
}
`[DELETE]: https://mindaugaslazauskas.com/api/users/avatar-remove`
