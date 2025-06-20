import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './ormconfig';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './auth/jwt.strategy';
import { LandmarksModule } from './landmarks/landmarks.module';
import { PolaroidsModule } from './polaroids/polaroids.module';
import { AuthModule } from './auth/auth.module';
import { VisionModule } from './vision_ai/vision.module';
import { BookmarkModule } from './bookmarks/bookmarks.module';
import { LikesModule } from './likes/likes.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    UsersModule,
    LandmarksModule,
    PolaroidsModule,
    VisionModule,
    BookmarkModule,
    LikesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtStrategy }],
})
export class AppModule {}
