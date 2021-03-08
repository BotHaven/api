import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { Game, GameDocument } from '../game/schemas/game.schema';
import { ITitles } from '../interfaces/titles.interface';

export type UserDocument = User & Document;
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

/* Virtuals */
UserSchema.virtual('level').get(function (this: UserDocument) {
  return xpToLevel(this.experience);
});
UserSchema.virtual('title').get(function (this: UserDocument) {
  const lvl = xpToLevel(this.experience);
  const lvls = Object.values(ITitles);
  const closest = lvls.reduce(function (prev, curr) {
    return Math.abs(curr - lvl) < Math.abs(prev - lvl) ? curr : prev;
  });
  const closestIndex = lvls.indexOf(closest);
  return Object.keys(ITitles)[closestIndex];
});

/* Helpers */
function xpToLevel(xp: number): number {
  return Math.floor(xp / 10);
}
