import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { Game, GameDocument } from '../game/schemas/game.schema';

export interface Statics {
  findMyGames: any;
  getLevel: () => Promise<number>;
}
export type UserDocument = User & Document & Statics;
export interface PopulatedUserDocument extends UserDocument {
  games: GameDocument[];
}

@Schema({
    toJSON: { virtuals: true },
  })
export class User {
  @Prop({ required: true, type: String, unique: true })
  username: string;
  @Prop({ required: true, type: String })
  password: string;
  @Prop({ required: false, type: String, unique: true })
  oauth_id: string;
  @Prop({
    required: false,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Game' }],
  })
  games: GameDocument[];
  @Prop({ required: false, type: String, default: '' })
  bio: string;
  @Prop({ required: false, type: Number, default: 0 })
  experience: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Static methods
UserSchema.statics.findMyGames = async function (
  this: Model<Document<User>>,
  username: string,
) {
  return this.findOne({ username }).populate('games').exec();
};

UserSchema.method("getLevel",async function (this: UserDocument){
  if (!this.games.length) return 0;
  return this.populate('games')
    .execPopulate()
    .then((populatedUser) => {
      return Math.floor(
        populatedUser.games
          .map((game) => {
            return game.scores.get(this.username);
          })
          .reduce((prev, acc) => (acc += prev), 0) * Math.PI,
      );
    });
})