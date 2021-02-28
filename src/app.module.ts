import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoreboardModule } from './scoreboard/scoreboard.module';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GameModule } from './user/game/game.module';
import { ScoreModule } from './user/game/score/score.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScoreboardModule,
    UserModule,
    GameModule,
    ScoreModule,
    LifecycleModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${
        process.env.DB_PASS
      }@cluster0.gigw5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
