const Redis = require('ioredis');

const redis = new Redis({
    host: "127.0.0.1", // hoặc process.env.REDIS_HOST
    port: 6379,
    password: null,    // nếu có password thì thêm vào
})

module.exports = redis;