import { Body, Controller, Delete, Get, Logger, Post } from "@nestjs/common";

import { AppService } from "@/app.service";
import { todoDocument } from "@/schema/todo.schema";

@Controller()
export class AppController {
  private logger: Logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {
    this.logger.debug({
      message: "Entering constructor of " + AppController.name,
    });
  }

  @Get()
  async get(): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering get route",
      });

      const todos: todoDocument[] = await this.appService.get();
      this.logger.log({
        message: "After getting todos",
        todos_length: todos.length,
      });

      return {
        statusCode: 200,
        success: true,
        data: todos,
      };
    } catch (error) {
      this.logger.error({
        message: "Error getting todos",
        error: error,
      });
      return {
        statusCode: 500,
        success: false,
        error: error.message,
      };
    }
  }

  @Post()
  async upsert(@Body() upsertData: any): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering upsert route",
        upsertData: upsertData,
      });

      const { _id, ...data } = upsertData;
      const todo: todoDocument = await this.appService.upsert(data, _id);
      this.logger.log({
        message: "After upserting todo",
        id: todo._id,
      });

      return {
        statusCode: 200,
        success: true,
        data: todo,
      };
    } catch (error) {
      this.logger.error({
        message: "Error deleting todo",
        id: upsertData.id,
        error: error,
      });
      return {
        statusCode: 500,
        success: false,
        error: error.message,
      };
    }
  }

  @Delete()
  async delete(@Body() deleteData: any): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering delete route",
        deleteData: deleteData,
      });

      const todo: todoDocument = await this.appService.delete(deleteData._id);
      this.logger.log({
        message: "After deleting todo",
        id: todo._id,
      });

      return {
        statusCode: 200,
        success: true,
        data: todo,
      };
    } catch (error) {
      this.logger.error({
        message: "Error deleting todo",
        id: deleteData.id,
        error: error,
      });
      return {
        statusCode: 500,
        success: false,
        error: error.message,
      };
    }
  }
}
