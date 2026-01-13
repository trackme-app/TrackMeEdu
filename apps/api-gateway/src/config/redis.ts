import { RedisClientOptions, createClient } from 'redis';
import logger from '../helpers/logger';

const redisConfig: RedisClientOptions = {
    socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
    database: Number(process.env.REDIS_DB) || 0,
};

const client = createClient(redisConfig);

client.on('error', (err) => {
    logger.error({
        "dt": Date(),
        "service": "Gateway.Redis",
        "context": "RedisClient",
        "message": "Redis client error",
        "httpStatus": null,
        "tenantId": null,
        "error": err
    });
});

// connect immediately (safe in most setups)
(async () => {
    try {
        await client.connect();
        logger.info({
            "dt": Date(),
            "service": "Gateway.Redis",
            "context": "RedisClient",
            "message": "Redis connected",
            "httpStatus": null,
            "tenantId": null,
            "error": null
        });
    } catch (err) {
        logger.error({
            "dt": Date(),
            "service": "Gateway.Redis",
            "context": "RedisClient",
            "message": "Failed to connect to Redis",
            "httpStatus": null,
            "tenantId": null,
            "error": err
        });
    }
})();

// graceful shutdown: quit instead of destroy
process.on('SIGINT', async () => {
    try {
        await client.quit();
        logger.info({
            "dt": Date(),
            "service": "Gateway.Redis",
            "context": "RedisClient",
            "message": "Redis disconnected",
            "httpStatus": null,
            "tenantId": null,
            "error": null
        });
    } catch (err) {
        logger.error({
            "dt": Date(),
            "service": "Gateway.Redis",
            "context": "RedisClient",
            "message": "Failed to disconnect from Redis",
            "httpStatus": null,
            "tenantId": null,
            "error": err
        });
        client.destroy();
    } finally {
        process.exit(0);
    }
});

export default client;
