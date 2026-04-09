import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreationType } from '../schemas/event.schema';

const CREATION_TYPES: CreationType[] = ['game', 'tournament', 'campaign', 'league'];

export class EventLocationDto {
  @ApiProperty({ example: 'Point' })
  @IsString()
  type: 'Point';

  @ApiProperty({ example: [-3.7038, 40.4168] })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class CreateEventDto {
  @ApiProperty({ example: 'Torneo de primavera' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: CREATION_TYPES })
  @IsEnum(CREATION_TYPES)
  type: CreationType;

  @ApiProperty({ example: 'warhammer40k' })
  @IsString()
  @IsNotEmpty()
  game: string;

  @ApiPropertyOptional({ example: '10th Edition' })
  @IsOptional()
  @IsString()
  system?: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ example: '2026-05-02' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  contactUrl?: string;

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxPlayers?: number;

  @ApiPropertyOptional({ example: 'Madrid' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeName?: string;

  @ApiPropertyOptional({ type: EventLocationDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EventLocationDto)
  location?: EventLocationDto;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  locationRadius?: number;
}
