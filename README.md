# Recall Soundboard

This is a soundboard sample app that integrates with [Recall.ai](https://recall.ai) to allow playing sounds in online meetings. It uses a Recall.ai bot to join meetings and plays sounds based on commands sent through a web interface.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [ngrok](https://ngrok.com/download) (for local development)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/recallai/soundboard.git
    cd soundboard
    ```

2.  **Start up ngrok**

    Start up an ngrok tunnel on port 4000. You will need to add this to the .env in the next step and you will also access the app from the same ngrok URL

3.  **Create an .env file:**

    Copy the `.env.sample` file to a new file named `.env` using the command below:

    ```bash
    cp .env.sample .env
    ```

    You will need to then fill the missing variables in the .env

4.  **Run the application:**

    Once done, you can start the application in development mode using the helper script:

    ```bash
    ./scripts.sh dev:up
    ```

    Once loaded, you can then open the ngrok URL in your browser and the app should be running!

## Available Commands

This project includes a helper script `./scripts.sh` to manage the application with Docker.

**Usage:**

```bash
./scripts.sh [COMMAND]
```

**Examples:**

```bash
# Start the development server
./scripts.sh dev:up

# Stop the development server
./scripts.sh dev:down

# View logs for the development server
./scripts.sh dev:logs
```

### Development Commands

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `dev:build`       | Build development Docker image              |
| `dev:up`          | Start development environment (with logs)   |
| `dev:up:detached` | Start development environment in background |
| `dev:down`        | Stop development environment                |
| `dev:logs`        | Show development logs                       |

### Production Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `prod:build`       | Build production Docker image              |
| `prod:up`          | Start production environment (with logs)   |
| `prod:up:detached` | Start production environment in background |
| `prod:down`        | Stop production environment                |
| `prod:logs`        | Show production logs                       |

### Utility Commands

| Command   | Description                 |
| --------- | --------------------------- |
| `health`  | Check application heartbeat |
| `cleanup` | Clean up Docker resources   |
| `help`    | Show the help message       |

## How It Works

This application uses a Recall.ai bot to join meetings and play sounds. The process involves a user-facing control panel, a WebSocket server for real-time communication, and a special soundboard page that the bot screen-shares into the meeting.

<!-- You can add your architecture diagram here -->

Here’s the step-by-step flow:

1.  **Bot Creation**: A user provides a meeting link in the client. This triggers a request to the server to create a new Recall.ai bot using `src/recall/createBot.ts`.

2.  **Joining and Screen-sharing**: The bot joins the specified meeting and immediately begins screen-sharing the app's `/soundboard` page. The `clientId` in the URL (`/soundboard?clientId=<bot-id>`) identifies this session. The bot itself also connects to this app's server via websocket

3.  **WebSocket Connection**: The `/soundboard` page, now active inside the meeting via screen-share, connects to the server via websocket (`src/websockets/initWebSocketServer.ts`). It identifies itself using the `clientId` from its URL, allowing the server to route commands to it.

4.  **Triggering a Sound**: The user can send chat messages in the chat. The bot will forward the participant's chat messages over websocket to this app's server.

5.  **Relaying the Command**: The server receives the request. It looks up the correct WebSocket connection using the `clientId` and sends a message containing the URL of the sound file to play to the client.

6.  **Playing Audio**: The `/soundboard` page receives the message via its WebSocket connection and plays the audio file. Because the bot is sharing its audio, everyone in the meeting hears the sound.

7.  **Stopping the Bot**: The user can remove the bot from the call by sending `!kick` in-chat, which calls `src/recall/removeBotFromCall.ts`.

## Important Files

A quick guide to the key files in this project.

`src/server.ts` is the main entry point that starts the Next.js application and the WebSocket server.

### Client

- `src/app/(client)/_hooks/use-play-soundboard.ts`: React hook to manage the client's WebSocket connection and play sounds.

### Server

- `src/websockets/initWebSocketServer.ts`: Initializes the WebSocket server. Both the client and the bot will connect to this websocket, allowing this server to receive meeting info from the bot and communicate with the client.
- `src/recall/createBot.ts`: Handles creating a Recall bot and sends it to a meeting. The bot is configured to send a welcome chat message upon joining a meeting and screenshares this soundboard application.
- `src/recall/sendChatMessage.ts`: Sends a chat message to the meeting via the bot to trigger a sound.
- `src/recall/removeBotFromCall.ts`: Removes the Recall bot from the meeting.

## Troubleshooting

### Using ngrok for Local Development

When running this application locally, you need to expose your local server to the internet so Recall.ai can connect to it. `ngrok` is a great tool for this.

The `APP_HOST` variable in your `.env` file must be set to your public `ngrok` URL.

#### Note on disposable vs static ngrok URLs

If you are using a free `ngrok` account, you will get a new disposable URL every time you restart `ngrok`. You will need to update your `.env` file with the new URL each time.

For a more stable setup, `ngrok` offers static domain names on their free plan. This will give you a permanent URL you can set in your `.env` file once.
