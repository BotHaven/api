import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { Game, GameDocument } from '../schemas/game.schema';

@Injectable()
export class ScoreService {
    constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>){
        return;
    }
    async inc(game: GameDocument, invitedUsername: string){
        if(!game) throw new NotFoundException("game not found")
        if(!invitedUsername) throw new ConflictException("couldnt find user");
        const hasUsername = game.scores.has(invitedUsername);
        if(!hasUsername) throw new ConflictException("couldnt find user to invite"); 
        game.scores.set(invitedUsername,game.scores.get(invitedUsername) + 1);
        game.markModified(`scores`);
        return game.save()
    }
    async dec(game: GameDocument, invitedUsername: string){
        if(!game) throw new NotFoundException("game not found")
        if(!invitedUsername) throw new ConflictException("couldnt find user");
        const hasUsername = game.scores.has(invitedUsername);
        if(!hasUsername) throw new ConflictException("couldnt find user to invite"); 
        game.scores.set(invitedUsername,game.scores.get(invitedUsername) - 1);
        game.markModified("scores");
        return game.save()
    }
    async set(game: GameDocument, username: string, num: number){
        if(!game) throw new NotFoundException("game not found")
        if(!username) throw new ConflictException("couldnt find user")
        const hasUsername = game.scores.has(username);
        if(!hasUsername) throw new ConflictException("couldnt find user to invite"); 
        if(typeof num != "number") throw new ForbiddenException("not a number")
        game.scores.set(username,num);
        game.markModified("scores");
        return game.save()
    }
    
}
