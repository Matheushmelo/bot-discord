import { ExtendedClient } from "./structs/ExtendedClient";
import config from "./config.json";
import path from "path";
import fs from "fs";
export * from "colors";

const client = new ExtendedClient();
client.start();

export { client, config };
