require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const prisma = require('./src/config/db.config');
const redisClient = require('./src/config/redis.config');
const errorMiddleware = require('./src/middlewares/error.middleware');
const loggerMiddleware = require('./src/middlewares/logger.middleware');
const {initWebSocket} = require('./src/utils/websocket.js');
const http = require('http');

const mainApiRouter = require('./src/routes/');
const {createServer} = require("node:http");
const app = express();
const server = http.createServer(app);
// init socket
initWebSocket(server);

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logger middleware
app.use(loggerMiddleware);


app.use('/api/v1', mainApiRouter);

// Error handler must be last
app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;

(async () => {
    try {
        await prisma.$connect();
        console.log("✅ Prisma connected");

        console.log("✅ Redis status:", redisClient.status);

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Startup error:", err);
        process.exit(1);
    }
})();

// Sau khi server đã lắng nghe, khởi động các cron jobs
const { startCrons } = require('./src/utils/cronScheduler.js');

startCrons();

console.log("[Scheduled] Cron jobs started _________________________________");
