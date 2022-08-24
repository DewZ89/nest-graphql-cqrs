import { Test, TestingModule } from '@nestjs/testing'
import { PasswordService } from './password.service'

describe('PasswordService', () => {
  let service: PasswordService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile()

    service = module.get<PasswordService>(PasswordService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('hashPassword', () => {
    it('should hash given data', async () => {
      // Given
      const plainTextPassword = 'secret'

      // When
      const hashedString = await service.hash(plainTextPassword)

      // Then
      expect(hashedString).toBeDefined()
      expect(hashedString).toContain('$argon')
    })
  })

  describe('verify', () => {
    const hash =
      '$argon2id$v=19$m=4096,t=3,p=1$MAAAOEv+MtO13icVU4XnJw$Njk8sRoRro47BWvXsymt9wBT9FQG652c/bJVCb6YThQ'

    it('should return "true" if password is correct', async () => {
      // Given
      const password = 'secret'

      // When..Then
      await expect(service.verify(hash, password)).resolves.toBe(true)
    })

    it('should return false if pwd incorrect', async () => {
      // Given
      const password = 'secret1'

      // When..Then
      await expect(service.verify(hash, password)).resolves.toBe(false)
    })
  })
})
