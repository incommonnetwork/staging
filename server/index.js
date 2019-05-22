/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');

async function main() {
    // production uses another server for exported frontend pages
    if (process.env.NODE_ENV !== 'production') {
        const nextApp = require('./nextApp').nextApp;
        await nextApp.prepare();
    }

    const server = app.listen(port);

    process.on('unhandledRejection', (reason, p) =>
        logger.error('Unhandled Rejection at: Promise ', p, reason),
    );

    server.on('listening', () =>
        logger.info(
            'Feathers application started on http://%s:%d',
            app.get('host'),
            port,
        ),
    );
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});