import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SportsService } from './sports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sports.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('sports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sports (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all sports.',
    type: [Sport],
  })
  async findAll(): Promise<Sport[]> {
    return this.sportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sport by id (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the sport',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the sport with the specified id.',
    type: Sport,
  })
  @ApiResponse({
    status: 404,
    description: 'Sport with the specified id was not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Sport> {
    return this.sportsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sport (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The sport has been successfully created.',
    type: Sport,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid sport data provided.',
  })
  @ApiResponse({
    status: 409,
    description: 'A sport with the same name already exists.',
  })
  async create(@Body() sportData: CreateSportDto): Promise<Sport> {
    return this.sportsService.create(sportData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sport (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the sport to update',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The sport has been successfully updated.',
    type: Sport,
  })
  @ApiResponse({
    status: 404,
    description: 'Sport with the specified id was not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Another sport with the same name already exists.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sportData: UpdateSportDto,
  ): Promise<Sport> {
    return this.sportsService.update(id, sportData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sport (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the sport to delete',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The sport has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Sport with the specified id was not found.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Cannot delete the sport because it has associated classes. The classes must be deleted first.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.sportsService.remove(id);
  }
}
