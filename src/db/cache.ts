import { config } from "@config/config";
import { createClient } from "redis";

const { user, password, host, port } = config.cache;
const client = createClient({
  url: `redis://${user}:${password}@${host}:${port}`,
});

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
