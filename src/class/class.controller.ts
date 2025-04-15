import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { SportsClass } from './entities/sports-class.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces/auth.interface';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get all sports classes (Admin and User)' })
  @ApiResponse({
    status: 200,
    description: 'Return all sports classes.',
    type: [SportsClass],
  })
  @ApiQuery({
    name: 'sport',
    required: false,
    description:
      'Filter by sport name(s). Multiple sports can be specified as comma-separated values.',
  })
  @Get()
  async findAll(@Query('sport') sport?: string): Promise<SportsClass[]> {
    const sportNames = sport ? sport.split(',') : undefined;
    return this.classService.findAll(sportNames);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get a sports class by id (Admin and User)' })
  @ApiResponse({
    status: 200,
    description: 'Return the sports class.',
    type: SportsClass,
  })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SportsClass> {
    return this.classService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Register for a sports class (Admin and User)' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered for the class.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @Post(':id/register')
  async registerForClass(
    @Param('id', ParseIntPipe) classId: number,
    @Request() req: RequestWithUser,
  ): Promise<any> {
    return this.classService.registerForClass(req.user.id, classId);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new sports class (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The class has been successfully created.',
    type: SportsClass,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@Body() classData: CreateClassDto): Promise<SportsClass> {
    return this.classService.create(classData);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a sports class (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully updated.',
    type: SportsClass,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() classData: UpdateClassDto,
  ): Promise<SportsClass> {
    return this.classService.update(id, classData);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a sports class (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.classService.remove(id);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all registrations for a class (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Return all registrations for the class.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @Get(':id/registrations')
  async getClassRegistrations(
    @Param('id', ParseIntPipe) classId: number,
  ): Promise<any[]> {
    return this.classService.getClassRegistrations(classId);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Unregister from a sports class (Admin and User)' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unregistered from the class.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Registration not found.' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @Delete(':id/unregister')
  async unregisterFromClass(
    @Param('id', ParseIntPipe) classId: number,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    return this.classService.unregisterFromClass(req.user.id, classId);
  }
}
