import { Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { TODO_MODEL, todoDocument } from "@/schema/todo.schema";

@Injectable()
export class AppService {
  private logger: Logger = new Logger(AppService.name);

  constructor(
    @InjectModel(TODO_MODEL, DATABASE_CONNECTION_NAME.TODO_LIST_DB)
    private readonly todoModel: Model<todoDocument>
  ) {
    this.logger.debug({
      message: "Entering constructor of " + AppService.name,
    });
  }

  async get(): Promise<todoDocument[]> {
    try {
      this.logger.debug({
        message: "Entering get method",
      });

      const projection = {
        _id: 1,
        title: 1,
        description: 1,
        expiry: 1,
        done: 1,
      };
      const todos: todoDocument[] = await this.todoModel
        .find({})
        .select(projection);
      this.logger.log({
        message: "After getting todos",
        todos_length: todos.length,
      });

      return todos;
    } catch (error) {
      this.logger.error({
        message: "Error getting todos",
        error: error,
      });
      throw error;
    }
  }

  async upsert(data: any, id?: string): Promise<todoDocument> {
    try {
      this.logger.debug({
        message: "Entering upsert method",
        id: id,
      });

      let todo: todoDocument;
      if (id) {
        todo = await this.todoModel.findByIdAndUpdate(id, data, { new: true });
        this.logger.log({
          message: "After updating todo",
          id: todo._id,
        });
      } else {
        todo = await this.todoModel.create(data);
        this.logger.log({
          message: "After creating todo",
          id: todo._id,
        });
      }

      return todo;
    } catch (error) {
      this.logger.error({
        message: "Error upserting todo",
        error: error,
        id: id,
      });
    }
  }

  async delete(id: string): Promise<todoDocument> {
    try {
      this.logger.debug({
        message: "Entering delete method",
        id: id,
      });

      const todo: todoDocument = await this.todoModel.findByIdAndDelete(id);
      this.logger.log({
        message: "After deleting todo",
        id: todo._id,
      });

      return todo;
    } catch (error) {
      this.logger.error({
        message: "Error deleting todo",
        error: error,
        id: id,
      });
    }
  }
}
