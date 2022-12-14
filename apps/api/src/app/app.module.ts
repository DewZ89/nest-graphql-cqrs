import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AppService } from './app.service'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import {
  resolvers as scalarsResolvers,
  typeDefs as scalarsTypeDefs,
} from 'graphql-scalars'
import { environment } from '../environments/environment'
import { UsersModule } from '@blog/api/features/users'
import { AuthModule } from '@blog/api/features/auth'
import { PrismaModule } from '@blog/api/shared/prisma'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: !environment.production,
      playground: environment.showPlayground,
      typePaths: ['./**/*.graphql'],
      resolvers: [scalarsResolvers],
      typeDefs: [...scalarsTypeDefs],
    }),
    PrismaModule,
    UsersModule,
    AuthModule.register({ jwtSecretKey: environment.jwtSecretKey }),
  ],
  providers: [AppService],
})
export class AppModule {}
