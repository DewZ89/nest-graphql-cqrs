/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import { PrismaService } from '@blog/api/shared/prisma'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Workaround for enableShutdownHooks issue. See https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService = app.get<PrismaService>(PrismaService)
  await prismaService.enableShutdownHooks(app)

  const port = process.env.PORT || 3333
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/graphql`)
}

bootstrap()
