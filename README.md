## Build

From your project directory:

`docker build --memory="8g" -t blog-api .`

## Run

### Production

#### Database:

<strong>postgres</strong>:

`docker run -d --restart unless-stopped --name blog-db --mount type=volume,src=data,target=/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_DB=blog -e POSTGRES_PASSWORD=mysecretpassword postgres`

<strong>mysql</strong>:

`docker run -d --restart unless-stopped --name blog-db -v mysqldata:/var/lib/mysql -p 3306:3306 -e MYSQL_DATABASE=blog -e MYSQL_ROOT_PASSWORD=mysecretpassword -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysecretpassword mysql`

#### Cache:

`mkdir cacheVolume` <br />
`docker run -d --restart unless-stopped --mount type=volume,src=cacheVolume,target=/data -p 6379:6379 --name blog-redis redis redis-server --requirepass mysecretpassword --save 60 1 --loglevel warning`

#### Application:

<strong>postgres</strong>:

`docker run -d --restart unless-stopped -p=8000:8000 -e PORT=8000 -e TOKEN_SECRET=secret -e DB_USER=user -e DB_HOST=host -e DB=blog -e DB_PASSWORD=mysecretpassword -e DB_PORT=5432 -e CACHE_USER=user -e CACHE_PASSWORD=mysecretpassword -e CACHE_HOST=host -e CACHE_PORT=6379 -e AWS_ACCESS_KEY_ID=accessKeyId -e AWS_SECRET_ACCESS_KEY=secretAccessKey -e AWS_BUCKET_NAME=blog-avatars -e AWS_REGION=eu-central-1 --name=blog-api blog-api`

<strong>mysql</strong>:

`docker run -d --restart unless-stopped -p=8000:8000 -e PORT=8000 -e TOKEN_SECRET=secret -e DB_USER=user -e DB_HOST=host -e DB=blog -e DB_PASSWORD=mysecretpassword -e DB_PORT=3306 -e CACHE_USER=user -e CACHE_PASSWORD=mysecretpassword -e CACHE_HOST=host -e CACHE_PORT=6379 -e AWS_ACCESS_KEY_ID=accessKeyId -e AWS_SECRET_ACCESS_KEY=secretAccessKey -e AWS_BUCKET_NAME=blog-avatars -e AWS_REGION=eu-central-1 --name=blog-api blog-api`

### Development

#### Local:

#### db

<strong>postgres</strong>:

With data persistence:
`docker run -d --rm --name blog-db --mount type=volume,src=data,target=/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_DB=blog -e POSTGRES_PASSWORD=mysecretpassword postgres`

Without data persistence:
`docker run -d --rm --name blog-db -p 5432:5432 -e POSTGRES_DB=blog -e POSTGRES_PASSWORD=mysecretpassword postgres`

<strong>mysql</strong>:

With data persistence:
`docker run -d --name blog-db -v mysqldata:/var/lib/mysql -p 3306:3306 -e MYSQL_DATABASE=blog -e MYSQL_ROOT_PASSWORD=mysecretpassword -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysecretpassword mysql`

<strong>redis</strong>

`docker run --rm -d -p 6379:6379 --name blog-redis redis --requirepass mysecretpassword`

#### app

app:

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

`[POST]: http://localhost:8000/api/auth/signup`
{
"email": string,
"password": string,
"fullname": string
}

`[POST]: http://localhost:8000/api/auth/signin`
{
"email": string,
"password": string,
}

<strong>Posts</strong>:

`[GET]: http://localhost:8000/api/posts` <br />
`[GET]: http://localhost:8000/api/posts/{id}` <br />
`[POST]: http://localhost:8000/api/posts`
{
"title": string
"body": string
}

`[PUT]: http://localhost:8000/api/posts/{id}`
{
"title": string
"body": string
}

`[PUT]: http://localhost:8000/api/posts/{id}/status`
{
"status": "DRAFT" | "PUBLISHED"
}

`[DELETE]: http://localhost:8000/api/posts/{id}`

<strong>Users</strong>:

`[GET]: http://localhost:8000/api/users`
`[POST]: http://localhost:8000/api/users/avatar-upload`
Encoding: multipart/form-data
{
"file": File
}
`[DELETE]: http://localhost:8000/api/users/avatar-remove`
