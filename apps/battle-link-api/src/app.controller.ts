import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get('debug-sentry')
  @ApiOperation({ summary: 'Lanza un error de prueba para verificar Sentry' })
  getError(): never {
    throw new Error('My first Sentry error!');
  }
}
