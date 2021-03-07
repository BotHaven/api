import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  forwardRef,
  Get,
  GoneException,
  Header,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Agent } from './agent.decorator';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterUserDto, setBioDto } from './user.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  /**
   * Injected services:
   * @param userService
   * @returns
   */
  constructor(
    private userService: UserService) {
    return;
  }

  /**
   * Lists all users.
   * @returns {UsedDocument[]} - user
   */
  @Get('/')
  list() {
    return this.userService
      .list()
      .then((users) => users)
      .catch((err) => new BadRequestException('could not list all users'));
  }

  /**
   * Creates new user.
   * @param {CreateUserDto} createUserDto
   * @returns {UserDocument} user
   */
  @Post('/')
  create(@Body() createUserDto: RegisterUserDto) {
      return this.userService
        .create(createUserDto)
        .then()
        .catch();
  }

  /**
   * Gets User by `userIdentifier`.
   * @param userIdentifier - username | oauth_id
   * @returns {UserDocument} user
   */
  @Get('/:userIdentifier')
  get(@Agent() agent:string, @Param('userIdentifier') userIdentifier: string) {
    return this.userService.get(agent, userIdentifier)
      .then()
      .catch();
  }

  @Get("/:userIdentifier/level")
  getLevel(@Agent() agent:string, @Param('userIdentifier') userIdentifier: string) {
    return this.userService.get(agent, userIdentifier)
      .then(this.userService.getLevel)
      .catch();
  }

  /**
   * Sets user's bio.
   * @param username
   * @param {setBioDto} bio
   * @returns {UserDocument} user
   */
  @Patch('/:userIdentifier/bio')
  setBio(@Agent() agent:string,@Param('userIdentifier') username: string, @Body() bio: setBioDto) {
    return this.userService
      .get(agent, username)
      .then((user) => this.userService.setBio(user, bio.bio))
      .then((savedUser) => savedUser)
      .catch((err) => new BadRequestException('could not set bio'));
  }

  @Delete('/:userIdentifier')
  delete(@Agent() agent:string,@Param('userIdentifier') userIdentifier: string) {
    return this.userService
      .delete(agent, userIdentifier)
      .then((deletedUser) => deletedUser)
      .catch((err) => new BadRequestException('could not delete user'));
  }
}
