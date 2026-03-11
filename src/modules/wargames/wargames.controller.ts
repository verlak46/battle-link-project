import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WargamesService } from './wargames.service';

@ApiTags('wargames')
@Controller('wargames')
export class WargamesController {
  constructor(private readonly wargamesService: WargamesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los wargames disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de wargames.' })
  findAll() {
    return this.wargamesService.findAll();
  }
}
