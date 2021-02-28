import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mongoose, Schema as MongooseSchema } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({required: true, type: String})
  title: string;
  @Prop({required: true, type: String})
  _title: string;
  @Prop({required: false, type: MongooseSchema.Types.Map, ref: "Score", default: {}})
  scores: Map<string, number>
  
}

export const GameSchema = SchemaFactory.createForClass(Game);