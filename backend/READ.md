# Running FastAPI app with Docker and Docker Compose

This is a simple example of a FastAPI app running in Docker Compose with a PostgreSQL database.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone this repository:

   `git clone https://github.com/IrinaDorosh88/RiverModel.git`

2. Navigate to the repository directory:

   `cd RiverModel/backend`

3. Build an external network for the app:

   `docker network create app_net`

4. Start the app and database containers using Docker Compose:

   `docker-compose up -d --build`

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

# Getting Started with Git: Basic Commands and Workflow

## Basic Git Commands for Version Control

Here's a brief rundown of some basic Git commands:

`git status`: This command shows the current state of your local Git repository, including which files have been modified or added.

`git add`: This command adds changes to the staging area, preparing them to be committed to the repository. You can use `git add <filename>` to add specific files, or `git add .` to add all changes.

`git commit`: This command creates a new commit with the changes you've added to the staging area. You can use `git commit -m "<commit message>"` to add a commit message inline, or `git commit` to open a text editor where you can write a longer commit message.

`git push`: This command pushes your local commits to a remote repository, typically hosted on a service like GitHub or GitLab. You can use `git push <remote> <branch>` to specify which remote and branch to push to, or just `git push` to push to the default remote and branch.

`git pull`: This command pulls changes from a remote repository and merges them into your local branch. You can use `git pull <remote> <branch>` to specify which remote and branch to pull from, or just `git pull` to pull from the default remote and branch.

`git branch`: This command shows a list of all branches in your Git repository. You can create a new branch with `git branch <branchname>`.

`git checkout`: This command allows you to switch between branches or commit history. You can switch to a branch with `git checkout <branchname>` or a specific commit with `git checkout <commit hash>`.

There are many other Git commands and options available, but these basics should help you get started with managing changes to your codebase.

## Basic Git Workflow for working on a new functionality or fixing a bug

Here are the steps you can follow to start working on a new ticket using Git:

1. Make sure you are on the `master` branch: `git checkout master`
2. Pull the latest changes from the remote repository: `git pull origin master`
3. Create a new branch for your ticket: `git checkout -b feature/brief-description-of-feature` or `git checkout -b bug/brief-description-of-bug`
4. Make changes to the code and test it locally.
5. Once you are happy with your changes, stage the changes using `git add <file>` or `git add .` to stage all changes.
6. Use `git status` to check if there are no excess files in a list of files which you are going to commit.
7. Commit the changes with a meaningful commit message: `git commit -m "Your commit message"`
8. Push the changes to the remote branch: `git push origin feature/brief-description-of-feature`
9. If you need to make additional changes, repeat steps 5-8 until your code is complete.
10. When your code is complete, create a pull request on the remote repository and wait for code review and approval.
11. Once your pull request is approved, merge your changes to the `master` branch.

Remember to always keep your local repository up-to-date with the remote repository by pulling the latest changes before starting any work. This helps to prevent conflicts and ensure that you are working with the latest version of the code.

# Running Migrations with Alembic in FastAPI

## Introduction

Alembic is a powerful database migration tool that allows you to easily manage changes to your database schema over time. In this guide, we will walk through the steps of setting up and running migrations with Alembic in a FastAPI project.

## Prerequisites

Before we get started, make sure you have the following:

- A working FastAPI project
- SQLAlchemy installed
- Alembic installed

## Creating Migrations

1. Whenever you make changes to your models, create a new migration with the following command:

   `alembic revision --autogenerate -m "Your migration message here"`

   This will generate a new migration script in the `alembic/versions` directory based on the differences between your current models and the previous ones. Make sure to import the appropriate model in `models/__init__.py` and add it to the `__all__` attribute before creating a new migration. By defining the `__all__` attribute and adding the required models to it, you ensure that the models are included when generating Alembic migrations.

2. Review the generated migration script and make any necessary modifications.

3. Apply the migration to your database with the following command:
   
   `alembic upgrade head`

   This will apply all pending migrations to the database.

## Upgrading and Downgrading

To upgrade or downgrade to a specific migration, use the following commands:

- Upgrade to a specific migration:

   `alembic upgrade <migration_hash>`

- Downgrade to a specific migration:

   `alembic downgrade <migration_hash>`

Replace `<revision hash>` with the hash of the migration you want to downgrade to. You can find the hash of a migration in the filename of the migration script in the alembic/versions directory. Also, you can use the command `alembic downgrade -n`. The `-n` is used to specify the number of revisions to rollback. For example, `alembic downgrade -1` will rollback the database by one revision. This command is useful if you need to revert to a previous version of the database due to errors or other issues. It's important to note that rolling back the database can result in data loss, so it should be used with caution. It's recommended to create backups of the database before performing a rollback.
