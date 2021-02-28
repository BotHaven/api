import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { Agent } from '../agent.decorator';
import { UserService } from '../user.service';
import { CreateGameDto, SetTitleDto, InviteUserDto } from './game.dto';
import { GameService } from './game.service';
import { GameDocument } from './schemas/game.schema';

@Controller('/user/:userIdentifier/game')
export class GameController {
    constructor(private userService: UserService, private gameService: GameService){
        return;
    }

    @Get("/")
    list(@Agent() agent: string, @Param("userIdentifier") userIdentifier: string){
        return this.userService.get(agent, userIdentifier)
            .then((user) => this.userService.populateGames(user))
                .then((populatedUser) => populatedUser.games)
                .catch((err) => new BadRequestException("couldnt find games"));
    }

    @Get("/:gameIdentifier")
    get(@Agent() agent: string,@Param("userIdentifier") userIdentifier: string,@Param("gameIdentifier") gameIdentifier: string){
        return this.userService.get(agent,userIdentifier)
            .then((user) => this.userService.populateGames(user))
            .then((populatedUser) => this.gameService.get(populatedUser, gameIdentifier))
            .then()
            .catch((err) => new BadRequestException("cannot find game"));
    }

    @Post("/")
    create(@Agent() agent: string,@Param("userIdentifier") userIdentifier: string, @Body() createGameDto: CreateGameDto) {
        return this.userService.get(agent, userIdentifier)
            .then(this.userService.populateGames)
            .then((populatedUser) => this.gameService.create(populatedUser, createGameDto))
            .catch();
    }

    @Patch("/:gameIdentifier/title")
    setTitle(@Agent() agent: string,@Param("userIdentifier") userIdentifier: string,@Param("gameIdentifier") gameIdentifier: string, @Body() setTitleDto: SetTitleDto){
        return this.get(agent, userIdentifier, gameIdentifier)
            .then((game: GameDocument) => this.gameService.setTitle(game, setTitleDto.title))
            .then()
            .catch((err) => new BadRequestException("couldnt set title on game"));
    }

    @Put("/:gameIdentifier/invite")
    inviteUser(@Agent() agent: string,@Param("userIdentifier") userIdentifier: string, @Param("gameIdentifier") gameIdentifier: string, @Body() inviteUserDto: InviteUserDto){
        return this.userService.get(agent,userIdentifier)
        .then(this.userService.populateGames)
        .then((populatedUser) => {
            return this.userService.getByUsername(inviteUserDto.user)
                .then(this.userService.populateGames)
                .then((populatedUser2) => this.gameService.invite(populatedUser, gameIdentifier, populatedUser2))
                .catch()
        })
    }

    @Delete("/:gameIdentifier")
    delete(@Agent() agent: string, @Param("userIdentifier") userIdentifier: string,@Param("gameIdentifier") gameIdentifier: string){
        return this.userService.get(agent, userIdentifier)
        .then(this.userService.populateGames)
        .then((populatedUser) => this.gameService.delete(populatedUser, gameIdentifier))
        .then((val) => val == undefined ? new BadRequestException("game not found") : val)
        .catch()
    }


}
