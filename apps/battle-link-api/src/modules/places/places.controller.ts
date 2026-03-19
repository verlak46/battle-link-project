import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  findAll() {
    return this.placesService.findApproved();
  }

  @UseGuards(AdminGuard)
  @Get('pending')
  findPending() {
    return this.placesService.findPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePlaceDto, @CurrentUser() user: JwtPayload) {
    return this.placesService.create(dto, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePlaceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.placesService.update(id, dto, user.sub);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.placesService.approve(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.placesService.reject(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.placesService.remove(id, user.sub, false);
  }
}
