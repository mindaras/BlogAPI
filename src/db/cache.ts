import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.error("Redis error:", err));

let connected = false;

const getCacheClient = async () => {
  if (!connected) {
    await client.connect();
    connected = true;
  }

  return client;
};

export { getCacheClient };
