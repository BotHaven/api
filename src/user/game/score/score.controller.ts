import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent } from 'src/user/agent.decorator';
import { UserService } from 'src/user/user.service';
import { GameService } from '../game.service';
import { Game, GameDocument } from '../schemas/game.schema';
import { ScoreService } from './score.service';

@Controller('/user/:userIdentifier/game/:gameIdentifier/score')
export class ScoreController {
    constructor(@InjectModel(Game.name) gameModel: Model<GameDocument>,private userService: UserService, private gameService: GameService, private scoreService: ScoreService){
        return;        
    }    

    @Patch("/:invitedUsername/inc")
    async inc(@Agent() agent: string,@Param("userIdentifier") userIdentifier: string, @Param("gameIdentifier") gameIdentifier: string, @Param("invitedUsername") invitedUsername: string) {
                return this.userService.get(agent,userIdentifier)
                .then(this.userService.populateGames)
                .then((populatedUser) => this.gameService.get(populatedUser, gameIdentifier))
                .then((game) => this.scoreService.inc(game, invitedUsername.toLocaleLowerCase()))
                .catch();
    }
    @Patch("/:invitedUsername/dec")
    async dec(@Agent() agent: string,@Param("userIdentifier") userIdentifier: string, @Param("gameIdentifier") gameIdentifier: string, @Param("invitedUsername") invitedUsername: string) {
                return this.userService.get(agent, userIdentifier)
                    .then(this.userService.populateGames)
                    .then((populatedUser) => this.gameService.get(populatedUser, gameIdentifier))
                    .then((game) => this.scoreService.dec(game, invitedUsername.toLocaleLowerCase()))
                    .catch();
    }
    @Patch("/:invitedUsername/set/:num")
    async set(@Param("userIdentifier") userIdentifier: string, @Param("gameIdentifier") gameIdentifier: string, @Param("invitedUsername") username: string, @Param("num", ParseIntPipe) num: number) {
        return this.userService.getByUsername(userIdentifier)
            .then(this.userService.populateGames)
            .then((populatedUser) => this.gameService.get(populatedUser, gameIdentifier))
            .then((game) => this.scoreService.set(game, username.toLocaleLowerCase(), num))
            .catch();
    }

    @Patch("/:username/reset")
    async reset(@Param("userIdentifier") userIdentifier: string, @Param("gameIdentifier") gameIdentifier: string, @Param("username") username: string) {
        return this.userService.getByUsername(userIdentifier)
            .then(this.userService.populateGames)
            .then((populatedUser) => this.gameService.get(populatedUser, gameIdentifier))
            .then((game) => this.scoreService.set(game, username.toLocaleLowerCase(), 0))
            .catch();

    }

}
