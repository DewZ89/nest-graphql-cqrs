import { Test } from '@nestjs/testing'
import { ApiFeaturesUsersService } from './api-features-users.service'

describe('ApiFeaturesUsersService', () => {
  let service: ApiFeaturesUsersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiFeaturesUsersService],
    }).compile()

    service = module.get(ApiFeaturesUsersService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
