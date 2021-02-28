import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { GameModule } from '../game.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [GameModule, UserModule],
  providers: [ScoreService],
  controllers: [ScoreController],
  exports: [ScoreService]
})
export class ScoreModule {}
