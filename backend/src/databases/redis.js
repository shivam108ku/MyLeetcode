const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDISPASS,
  socket: {
    host: "redis-12862.c240.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 12862,
    keepAlive: 1,
    reconnectStrategy: retries => Math.min(retries * 100, 3000),
  },
});

// ✅ Catch errors to avoid crashing
redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

// ✅ Optional: Monitor reconnects
redisClient.on("reconnecting", () => {
  console.warn("🔄 Redis reconnecting...");
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

// ✅ Call connect() to start the connection
redisClient.connect().catch(err => {
  console.error("❌ Redis Connect Error:", err.message);
});

module.exports = redisClient;
