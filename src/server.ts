import 'dotenv/config';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '4000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    // Import and initialize the WebSocket server
    const { initWebSocketServer } = await import('./websockets/initWebSocketServer');
    initWebSocketServer(server);

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('Received SIGTERM, shutting down gracefully');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });

    server.listen(port, hostname, (err?: Error) => {
        if (err) throw err;

        const appHost = process.env.APP_HOST || `http://localhost:${port}`;

        const colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            green: '\x1b[32m',
            blue: '\x1b[34m',
            cyan: '\x1b[36m',
            yellow: '\x1b[33m',
            magenta: '\x1b[35m',
            gray: '\x1b[90m',
            white: '\x1b[37m'
        };

        // Clear terminal
        console.log('\x1Bc');

        // Print server info
        console.log(`
${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.green}${colors.bright}🚀 Recall.ai Soundboard Server Started${colors.reset}

${colors.white}✅ Server ready and listening on port ${port}${colors.reset}
${colors.white}${colors.bright}🌍 Environment: ${process.env.NODE_ENV}${colors.reset}

${colors.cyan}${colors.bright}📍 Open in browser:${colors.reset}
   ${colors.blue}${colors.bright}${appHost}${colors.reset} 

${colors.white}${colors.bright}💡 Usage:${colors.reset}
   ${colors.white}1. Expose port ${colors.yellow}${port}${colors.reset} ${colors.white}via ngrok${colors.reset}
   ${colors.white}2. Send a bot to a Google Meet, Zoom, Microsoft Teams, or WebEx meeting${colors.reset}
   ${colors.white}3. Type ${colors.yellow}<!word> (i.e. !hello)${colors.reset} ${colors.white}in meeting chat to trigger sounds${colors.reset}

${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`);
    });
}); 