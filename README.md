# Description
This is an example of creating a backend application using the following set of technologies:
- Nest,
- Typescript,
- Postgresql,
- Typeorm (versions above ^0.3.20)
- Creating Migrations, configuring usage and automatic execution
- Docker(API) - deploying applications to Docker
- Docker(DB) - Deploy DB in Docker
---

## Step-by-step instructions for creating project:

---

### Project creation and library installation

#### 1. Install nest-cli (If you already have nest-cli installed, skip this step)
```bash
npm i -g @nestjs/cli
```

#### 2. Create a new project using the nest cli
```bash
nest new <your-project-name>
```
If you have already created a folder for the project and are in it:
```bash
nest new .
```
Choose: npm for the package manager (or whichever you prefer)

#### 3. Install TypeOrm
```bash
npm install --save @nestjs/typeorm typeorm postgres pg
```
---

### Installation

```bash
$ npm install
```

---

### Additional settings
#### .env
```
PORT=4003

# -- POSRGRESS
POSTGRES_HOST=db_postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=my_db
```
PORT - port on which our project will run (used in the `src/main.ts`)

POSTGRES_HOST - host on which we will access the database

POSTGRES_PORT - database access port

POSTGRES_USER - you can use whatever you want, but don't forget to change in `typeorm.config` and `docker-compose`

POSTGRES_PASSWORD - you can use whatever you want, but don't forget to change in `typeorm.config` and `docker-compose`

POSTGRES_DATABASE - - you can use whatever you want, but don't forget to change in `typeorm.config` and `docker-compose`

They are all used in `src/db/typeorm.config.ts` end `docker-compose.yml`

---

#### typeorm.config.ts
```bash
migrationsRun: true,
entities: [__dirname + '/../**/*.entity.{js,ts}'],
migrations: [__dirname + '/migrations/*.{js,ts}'],
```
`migrationsRun: true` -  We point out to Typeorm the need to check migrations and run them automatically if necessary.

`entities: [__dirname + '/../**/*.entity.{js,ts}']` -  We specify a Typeorm pattern for finding entities.

`migrations: [__dirname + '/migrations/*.{js,ts}']` -  We specify a Typeorm path to locate the migration files.

---

#### app.module.ts
```
import AppDataSource from 'src/db/typeorm.config';
...
@Module({
...
  imports: [TypeOrmModule.forRootAsync({
    useFactory: () => AppDataSource.options,
  }
  })],
...
}]
```

## Dockers

### docker-compose.yml

For API
```
  nest_api:
    container_name: nest_api
    build:
      context: ./docker/api/dev
      dockerfile: Dockerfile
    user: 'root'
    command: >
      bash -c "npm i
      && npm run build
      && nest start --debug 0.0.0.0:9229 --watch --preserveWatchOutput"
    ports:
      - '4003:4003'
      - '9229:9229'
    volumes:
      - .:/app
    depends_on:
      - db_postgres
    environment:
      - NODE_ENV=development
```
---
```
    build:
      context: ./docker/api/dev
      dockerfile: Dockerfile
```
Dockerfile location and name.

---
```
    ports:
      - '4003:4003'
```
Port on which we can access the application.

---
```
    depends_on:
      - db_postgres
```
Specify the name of the database container as a dependency.

The same name we use to access the database in `typeorm.config.ts` by specifying it in `.env` `POSTGRES_HOST=db_postgres`.

---
```
    environment:
      - NODE_ENV=development
```
Optional parameter, but sometimes without it the project autocompilation does not start after making changes in developer mode.

---

For DB

```
  db_postgres:
    container_name: db_postgres
    image: postgres:14.6-alpine
    restart: always
    user: root
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: my_db
    ports:
      - '5432:5432'
    volumes:
      - ./docker/pgdata:/var/lib/postgresql/data
```

---
```
    container_name: db_postgres
```
The container name we use in `depends_on:` for the application docker and in `.env` `POSTGRES_HOST=db_postgres`

---
```
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: my_db
```
Database parameters that we also use in `typeorm.config.ts` and `.env`.

---
```
    volumes:
      - ./docker/pgdata:/var/lib/postgresql/data
```
Specify the directory where the created database will be physically stored.

---

## Run API in local docker environment

> Be sure that the docker engine and docker compose utility are installed on your machine

> The next steps are needed in any system:

- Start api and db using `docker-compose up`

> You can drop `./docker/pgdata` folder to delete all data in DB.

You can connect debugger as external one to localhost:9229. Chose `Attach to Node.js/Chrome` on Webstorm debugger config
page and enjoy
---

## Migrations

Add the following commands to `package.json`
```
{
  ...
  "scripts": {
    ...
    "typeorm:config": "typeorm-ts-node-commonjs -d ./src/db/typeorm.config.ts",
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/db/typeorm.config.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d src/db/typeorm.config.ts",
    "migration:create": "typeorm-ts-node-commonjs migration:create src/db/migrations/migration",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/db/typeorm.config.ts"
  }
  ...
}
```
> All subsequent commands should be executed inside the nest_api application container.

To enter to nest_api container, after the containers have been fully started, run the command:

```bash
docker-compose exec nest_api bash
```

---
Use to create new migration:
```bash
npm run migration:generate src/db/migrations/<my-migration-name>
```

Migration would appear in src/db/migrations as the last one

---
Use to roll back the last migration:
```bash
npm run migration:revert
```

---
Use to run all migrations:
```bash
npm run migration:run
```

---
Use to run all migrations:
```bash
npm run migration:run
```

Use to create migrations:
```bash
npm run migration:create
```

Use to run one migration:
```bash
npm run migration:run src/db/<migration-file.ts>
```
---


#### License

It is [MIT licensed](LICENSE).
