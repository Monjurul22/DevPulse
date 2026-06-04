import "dotenv/config";
import app from "./app";
import { initDB } from "./db";

const port = Number(process.env.PORT) || 3000;

const main = () => {
  initDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

main();