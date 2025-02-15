import { registerAs } from "@nestjs/config";

import { DATABASE_CONNECTION_NAME } from "@/constants";

export const TODO_LIST_DB_CONFIG = registerAs(
  DATABASE_CONNECTION_NAME.TODO_LIST_DB,
  () => {
    return {
      MONGODB_URI: process.env["MONGODB_URI"],

      get dbUri() {
        return this.MONGODB_URI;
      },
    };
  }
);
