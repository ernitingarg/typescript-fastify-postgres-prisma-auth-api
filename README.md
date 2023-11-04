# typescript-fastify-auth-microservice

## Prerequisites installation

### Init

```bash
npm init -y
npx tsc --init
```

### Dependencies

```
npm install fastify fastify-zod zod zod-to-json-schema @fastify/swagger @fastify/swagger-ui @fastify/jwt @prisma/client bcrypt
```

### Dev Dependencies

```
npm install -D ts-node ts-node-dev typescript @types/node dotenv nodemon @types/bcrypt
```

### Prisma Initialization

```
npx prisma init --datasource-provider postgresql
```

### Prisma db Migration

```
npx prisma migrate dev --name init
```

### Launch prisma studio

```
npx prisma studio
```

### healthcheck

http://localhost:5000/api/health
http://localhost:5000/api/health/db

### Swagger documentation

http://localhost:5000/docs

## Run docker locally

To run database directly inside container, please follow below steps:

- Download docker

  - [Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Ubuntu](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

- To change environment variables, please use [.env](.env.example) file

- Run docker container

```bash
npm run start:docker
```

- To stop docker container

```bash
ctrl c
OR
docker-compose down

# To stop with data/volumne cleanup
docker-compose down -v --rmi all
```

- To see containers logs

```bash
docker-compose logs postgres
```

- To connect to Postgres database manually

```bash
 docker exec -it postgres bash
 psql -U admin -d postgresdb
```

- To see all tables in database

```bash
\dt;
```
