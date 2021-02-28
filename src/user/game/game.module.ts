import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user.module';
import { UserService } from '../user.service';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game, GameSchema } from './schemas/game.schema';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Game.name, schema: GameSchema}]), UserModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService, MongooseModule]
})
export class GameModule {}
