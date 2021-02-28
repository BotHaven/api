import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PopulatedUserDocument,
  User,
  UserDocument,
  UserSchema,
} from '../schemas/user.schema';
import { CreateGameDto } from './game.dto';
import { Game, GameDocument } from './schemas/game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>) {
    return;
  }

  /**
   * Gets user's game by title.
   * @param {UserDocument} populatedUser
   * @param {string} title
   * @returns {GameDocument} - game
   */
  async get(populatedUser: UserDocument, title: string) {
    const game = populatedUser.games.find(
      (game) => game._title === title.toLocaleLowerCase(),
    );
    const _id = game ? game._id : new Types.ObjectId();
    return this.gameModel.findOne({ _id });
  }

  /**
   * Creates new game for user.
   * @param {UserDocument} user
   * @param {CreateGameDto} createGameDto
   * @returns {GameDocument}
   */
  async create(user: PopulatedUserDocument, createGameDto: CreateGameDto) {
    const createdGame = new this.gameModel(createGameDto);
    const hasGame = user.games.find(
      (game) => game._title === createdGame._title,
    );
    if (hasGame) throw new ConflictException('game exists');
    
    createdGame.scores.set(user.username, 0);
    user.games.push(createdGame);
    user.markModified('games');
    user.save();
    return createdGame.save();
  }

  /**
   * Setting game title.
   * @param {GameDocument} game
   * @param {sting} title
   * @returns {GameDocument} game
   */
  async setTitle(game: GameDocument, title: string) {
    game.title = title;
    game._title = title.toLocaleLowerCase();
    game.markModified('title');
    game.markModified('_title');
    return game.save();
  }

  /**
   * Deletes game and curernt user's reference to it, not every reference to it.
   * @param populatedUser user
   * @param gameIdentifier game
   * @returns {any}
   */
  async delete(populatedUser: PopulatedUserDocument, gameIdentifier: string) {
    return this.get(populatedUser, gameIdentifier).then((game) => {
      if (!game) throw new NotFoundException("game not found");
      const index = populatedUser.games.findIndex(
        (_game) => _game.id == game._id,
      );
      const _id = populatedUser.games[index]._id;
      populatedUser.games.splice(index, 1);
      populatedUser.save();
      // Deleting game
      return this.gameModel.deleteOne({ _id: game._id },null, (err) => {
        // Finding references to game
        return this.userModel.where("games").in(_id).exec((err, res) => {
          if(err) return err;
  
          // Deleting references
          for(let user of res) {
            try {
            const index = user.games.findIndex((_game) => _game == game._id.toString());
            if(index < 0) continue;
            user.games.splice(index,1);
            user.markModified("games");
            user.save();
            } catch(err){}
          }
        })
      });
    });
  }

  /**
   * Invites user to game.
   * @param populatedUser invitee
   * @param gameIdentifier game
   * @param invitedUser invited user
   * @returns {UserDocument} - invited user
   */
  async invite(populatedUser: PopulatedUserDocument, gameIdentifier: string, invitedUser: PopulatedUserDocument){
    return this.get(populatedUser, gameIdentifier)
      .then((game) => {
        if(!game) throw new NotFoundException("cant find game");
        const invitedHasGame = invitedUser.games.find((_game) => _game.title == game.title);
        if(invitedHasGame) throw new ConflictException("already invited");
        game.scores.set(invitedUser.username, 0);
        game.markModified("scores");
        game.save();
        invitedUser.games.push(game);
        invitedUser.markModified("games");
        return invitedUser.save();
      })
  }
}
