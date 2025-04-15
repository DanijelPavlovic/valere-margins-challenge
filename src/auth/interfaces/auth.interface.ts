import { User } from 'src/user/entities/user.entity';
import { UserRole } from '../../user/enums/user-role.enum';

export interface JwtPayload {
  sub: number; // user id
  email: string;
  role: UserRole;
}

export interface JwtUser {
  id: number;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
  };
}

export interface ValidationError {
  property: string;
  constraints: Record<string, string>;
}

export interface ValidationErrorResponse {
  statusCode: number;
  message: string;
  errors: ValidationError[];
}

export interface RequestWithUser extends Request {
  user: User;
}
