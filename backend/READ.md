# FastAPI Docker Compose Example

This is a simple example of a FastAPI app running in Docker Compose with a PostgreSQL database.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone this repository:

    `git clone https://github.com/IrinaDorosh88/RiverModel.git`

2. Navigate to the repository directory:

    `cd RiverModel/backend`

3. Build the Docker image for the app:

    `docker build -t backend-river-model .`

4. Start the app and database containers using Docker Compose:

    `docker-compose up -d`

5. Open your web browser and go to `http://localhost:8000`. You should see the default FastAPI endpoint returning a "Hello, world!" message.

6. You can also interact with the database by connecting to the `postgresql` container using a PostgreSQL client. Use the following credentials:

- Host: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: `password`

## Configuration

You can customize the configuration of the app and database by modifying the `.env` file in the project directory. The following environment variables are available:

- `POSTGRES_USER`: The username for the PostgreSQL database user (default: `postgres`)
- `POSTGRES_PASSWORD`: The password for the PostgreSQL database user (default: `password`)
- `POSTGRES_DB`: The name of the PostgreSQL database to use (default: `fastapi_db`)
- `POSTGRES_PORT`: The port on which the PostgreSQL database is running (default: `5432`)
- `APP_PORT`: The port on which the FastAPI app is running (default: `8000`)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgments

- This project was created using the [FastAPI Docker Example](https://github.com/tiangolo/fastapi-docker-example) by [Sebastián Ramírez](https://github.com/tiangolo).
- Thank you to the FastAPI and Docker communities for creating such great tools!
