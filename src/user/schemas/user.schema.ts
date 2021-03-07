import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { Game, GameDocument } from '../game/schemas/game.schema';

export type UserDocument = User & Document;
export interface PopulatedUserDocument extends UserDocument {
  games: GameDocument[]
  findMyGames: any;
}

@Schema()
export class User {
  @Prop({required: true, type: String, unique: true})
  username: string;
  @Prop({required: true, type: String})
  password: string;
  @Prop({required: false, type: String, unique: true})
  oauth_id: string;
  @Prop({required: false, type: [{type: MongooseSchema.Types.ObjectId, ref: "Game"}]})
  games: GameDocument[];
  @Prop({required: false, type: String, default: ""})
  bio: string;
  @Prop({required: false, type: Number, default: 0})
  experience: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Static methods
UserSchema.statics.findMyGames = async function(
  this: Model<Document<User>>,
  username: string
) {
  return this.findOne({username}).populate("games").exec()
}