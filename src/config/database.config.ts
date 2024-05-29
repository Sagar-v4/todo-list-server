import { registerAs } from "@nestjs/config";

import { DATABASE_CONNECTION_NAME, ENVIRONMENT } from "@/constants";

export const TODO_LIST_DB_CONFIG = registerAs(
  DATABASE_CONNECTION_NAME.TODO_LIST_DB,
  () => {
    return {
      MONGODB_URI: process.env["MONGODB_URI"],
      DATABASE_NAME: process.env["DATABASE_NAME"],
      MONGODB_CONFIG: process.env["MONGODB_CONFIG"],
      MONGODB_LOCAL_URI: "mongodb://localhost:27017",

      isLocal() {
        return process.env["NODE_ENV"] === ENVIRONMENT.LOCAL;
      },

      getDbUri() {
        return this.isLocal() ? this.MONGODB_LOCAL_URI : this.MONGODB_URI;
      },

      get dbUri() {
        return `${this.getDbUri()}/${this.DATABASE_NAME}?${this.MONGODB_CONFIG}`;
      },
    };
  }
);
