/**
 * server initialization
 */
import dotenv from "dotenv";
import initializeRoles from "../utils/initializeRoles";
import { initDatabaseConnection } from "./database";
//load enviroment variables. This must be done before initializing the database
dotenv.config();

import app from "./app";

async function initServer() {
  await initDatabaseConnection();
  //we need to be sure that the roles are available before
  //any other process can request them
  await initializeRoles();
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`API available on port ${port}`));
}

initServer();
