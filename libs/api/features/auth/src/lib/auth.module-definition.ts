import { ConfigurableModuleBuilder } from '@nestjs/common'
import { AuthModuleOptions } from './types/auth-module-options.interface'

export const { MODULE_OPTIONS_TOKEN, ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<AuthModuleOptions>().build()
