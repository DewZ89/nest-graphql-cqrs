import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import {
  resolvers as scalarsResolvers,
  typeDefs as scalarsTypeDefs,
} from 'graphql-scalars'
import { environment } from '../environments/environment'

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
