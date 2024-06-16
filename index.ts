import app from "./src/app";
import { config } from "./src/config/ServerConfig";
import connectDatabase from "./src/config/db";
(async function StartServer() {
  await connectDatabase();
  app.listen(config.PORT, () => {
    console.log("Running the Server");
  });
})();
