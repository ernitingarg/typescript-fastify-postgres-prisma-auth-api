import buildServer from "./server";
import env from "./utils/config";

export const server = buildServer();

async function main() {
  try {
    const port = env.PORT ? parseInt(env.PORT) : 3000;
    await server.listen({
      port: port,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
