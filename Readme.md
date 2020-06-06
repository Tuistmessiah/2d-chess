This game was built to experiment with sockets in a practical and fast way. I implemented the whole stack: Private VPS (Ubuntu, PM2, NGINX), PostgreSQL database, Node server with REST and Sockets (Express, Socket.io) and React.

# Instructions

Connect easily with other people for a chess game. No log in, no accounts. Just set a game name and code and your one player code.

## How to

Just create a new session with a name and code made by you and input your own player passcode. Then share the session with your friend. As soon as the second player tries to enter the session (given the right name and code and inputing their one secret password), the game will be locked to any other player.

# Quick Start

### Setup the DB

Install dependencies: `install:all`

Install Postgres. Change the password in the script `reset_db.sh` for the user 'postgres'. Add a file named `db-configuration.json` in the folder `/database` with your db credentials. Example:

```
{
  "host": "localhost",
  "port": 5432,
  "database": "chess",
  "user": "postgres",
  "password": "postgres123"
}

```

Create a new local DB. Go to `/server` and run `npm run db:reset`

Back at root: `npm run start:dev`

## Client

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Run `npm run start:dev` in `/client` to start the frontend in development mode.

## Server

### Available scripts

`db:reset`: To create a clean DB to be used

`start:dev`: Start the server in development mode (you will need to install `nodemon` globally for this)
