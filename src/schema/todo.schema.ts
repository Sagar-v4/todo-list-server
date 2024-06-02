import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class Todo {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  expiry: number;

  @Prop({ type: Boolean, default: false })
  done: boolean;
}

export const todoSchema = SchemaFactory.createForClass(Todo);

export type todoDocument = Todo & Document & { _id: string };

export const TODO_MODEL = Todo.name;
