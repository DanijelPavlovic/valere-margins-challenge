import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoginDto } from '../dto/login.dto';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const loginDto = plainToClass(LoginDto, request.body);

    const errors = await validate(loginDto);
    if (errors.length) {
      const errorMessages = errors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints,
        };
      });
      throw new UnauthorizedException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
