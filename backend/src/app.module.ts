import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './apis/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import type { RedisClientOptions } from 'redis';
import redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sideproject_database',
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'sideproject',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      timezone: 'Asia/Seoul',
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://sideproject_redis:6379',
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
