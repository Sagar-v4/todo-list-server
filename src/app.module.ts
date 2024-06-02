import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AppService } from "@/app.service";
import { AppController } from "@/app.controller";
import configuration, { validate } from "@/config";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { TODO_MODEL, todoSchema } from "@/schema/todo.schema";
import { DatabaseModule } from "@/infra/mongoose/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configuration,
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    MongooseModule.forFeature(
      [{ name: TODO_MODEL, schema: todoSchema }],
      DATABASE_CONNECTION_NAME.TODO_LIST_DB
    ),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
