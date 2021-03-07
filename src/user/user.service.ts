import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PopulatedUserDocument,
  User,
  UserDocument,
} from './schemas/user.schema';
import { RegisterUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.get = this.get.bind(this);
    this.getByOauthId = this.getByOauthId.bind(this);
    this.getByUsername = this.getByUsername.bind(this);
    return;
  }

  /**
   * Lists all users.
   * @returns {UserDocument[]} users
   */
  async list() {
    return this.userModel.find();
  }

  /**
   * Create's user.
   * @param {RegisterUserDto} registerUserDto registerUserDto
   * @returns {UserDocument} user
   */
  async create(registerUserDto: RegisterUserDto) {
    const createdUser = new this.userModel(registerUserDto);
    return createdUser
      .save()
      .then()
      .catch((err) => {
        throw new ConflictException('already registered');
      });
  }

  async get(agent: string, userIdentifier: string){
    switch (agent) {
      case "discord / node-fetch":
        return this.getByOauthId(userIdentifier);
      default:
        return this.getByUsername(userIdentifier);
        break;
    }
  }

  /**
   * Get user by oauth_id.
   * @param oauth_id oauth_id
   * @returns {UserDocument} user
   */
  async getByOauthId(oauth_id: string) {
    console.log("oauth")
    return this.userModel.findOne({ oauth_id: oauth_id });
  }

  /**
   * Gets user by username.
   * @param username username
   * @returns {UserDocument} user
   */
  async getByUsername(username: string): Promise<UserDocument> {
    console.log("username")
    return new Promise((resolve, reject) => {
      return this.userModel.findOne(
        { username: username },
        null,
        null,
        (err, doc) => {
          if (doc) return resolve(doc);
          reject(new NotFoundException('couldnt find user'));
        },
      );
    });
  }

  /**
   * Sets user's bio.
   * @param {UserDocument} user user
   * @param {string} bio bio
   * @returns {UserDocument} user
   */
  async setBio(user: UserDocument, bio: string) {
    user.bio = bio;
    user.markModified('bio');
    return user.save();
  }

  /**
   * Deletes user.
   * @param {string} userIdentifier -
   * @returns {Document} deletedUser
   */
  async delete(agent: string,userIdentifier: string) {
    switch (agent) {
      case "discord / node-fetch":
        return this.deleteByOauthId(userIdentifier);
      default:
        return this.deleteByUsername(userIdentifier);
    }
  }

  async deleteByUsername(username: string){
    return this.userModel.deleteOne({ username});
  }
  async deleteByOauthId(oauth_id: string){
    return this.userModel.deleteOne({ oauth_id });
  }

  /**
   * Populates user's games.
   * @param {UserDocument} user
   * @returns {PopulatedUserDocument}
   */
  async populateGames(user: UserDocument): Promise<PopulatedUserDocument> {
    return new Promise((resolve, reject) => {
      if (!user) return reject(new NotFoundException('couldnt find user'));
      return user
        .populate('games')
        .execPopulate((err, res: PopulatedUserDocument) => {
          if (err) reject(err);
          return resolve(res);
        });
    });
  }

  /**
   * Deprecated
   * @param user 
   * @param experience 
   * @returns 
   */
  async addExperience(user: UserDocument | PopulatedUserDocument, experience: number): Promise<UserDocument> {
    if(!user.experience) user.experience = 0;
    user.experience += experience;
    user.markModified("experience");
    return user.save();
  }

  /**
   * Returns users level.
   * @param {UserDocument} user user
   * @returns {number} lvl
   */
  async getLevel(user: UserDocument): Promise<number>{
    return user.getLevel()
    .then()
    .catch()
  }

}
