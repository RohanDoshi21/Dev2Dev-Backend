> Steps to build using docker-compose

### 1. Starting all containers (including building)

```
    docker compose up -d
```

### 2. Stopping all containers (including removing)

```
    docker compose down
```

### 3. Removing volumes associated with containers

```
    docker compose down -v
```

> Connecting to postgres database

### 1. Get the postgres container id

```
    docker ps
```

### 2. Connect to postgres database

```
    docker exec -it postgres psql -U postgres
```

### 3. Some Useful Commands

```
    # List all databases
    \l

    # Use a databases
    \c postgres

    # List all tables
    \dt
```