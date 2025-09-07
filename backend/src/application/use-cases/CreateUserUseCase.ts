// Use Case - Create User (following Single Responsibility Principle)
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export interface CreateUserRequest {
  username: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface CreateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      // Business rule: Validate uniqueness
      const existingUserByUsername = await this.userRepository.findByUsername(request.username);
      if (existingUserByUsername) {
        return {
          user: null as any,
          success: false,
          message: 'Username already exists'
        };
      }

      const existingUserByEmail = await this.userRepository.findByEmail(request.email);
      if (existingUserByEmail) {
        return {
          user: null as any,
          success: false,
          message: 'Email already exists'
        };
      }

      // Create new user using domain entity
      const userData = User.create(
        request.username,
        request.email,
        request.name,
        request.avatar
      );

      const createdUser = await this.userRepository.create(userData);

      return {
        user: createdUser,
        success: true,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        user: null as any,
        success: false,
        message: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}