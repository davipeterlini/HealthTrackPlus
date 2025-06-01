// Presentation Controller - User (following Clean Architecture and Single Responsibility)
import { Request, Response } from 'express';
import { CreateUserUseCase, CreateUserRequest } from '../../application/use-cases/CreateUserUseCase';
import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export class UserController {
  private userService: UserService;
  private createUserUseCase: CreateUserUseCase;

  constructor() {
    const userRepository = new UserRepository();
    this.userService = new UserService(userRepository);
    this.createUserUseCase = new CreateUserUseCase(userRepository);
  }

  // Get current user (maintaining existing API)
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const userId = (req.user as any).id;
      const user = await this.userService.getUserById(userId);
      
      if (!user) {
        res.sendStatus(404);
        return;
      }

      // Map domain entity to API response format
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionEndDate: user.subscriptionEndDate,
        canAccessPremiumFeatures: user.canAccessPremiumFeatures(),
        hasActiveSubscription: user.hasActiveSubscription()
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Create new user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserRequest: CreateUserRequest = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        avatar: req.body.avatar
      };

      const result = await this.createUserUseCase.execute(createUserRequest);

      if (!result.success) {
        res.status(400).json({ message: result.message });
        return;
      }

      // Map domain entity to API response format
      res.status(201).json({
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
        subscriptionStatus: result.user.subscriptionStatus,
        canAccessPremiumFeatures: result.user.canAccessPremiumFeatures(),
        hasActiveSubscription: result.user.hasActiveSubscription()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update user subscription
  async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const userId = (req.user as any).id;
      const { stripeSubscriptionId, subscriptionStatus, subscriptionEndDate } = req.body;

      const updatedUser = await this.userService.updateSubscriptionInfo(userId, {
        stripeSubscriptionId,
        subscriptionStatus,
        subscriptionEndDate: subscriptionEndDate ? new Date(subscriptionEndDate) : undefined
      });

      if (!updatedUser) {
        res.sendStatus(404);
        return;
      }

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionEndDate: updatedUser.subscriptionEndDate,
        canAccessPremiumFeatures: updatedUser.canAccessPremiumFeatures(),
        hasActiveSubscription: updatedUser.hasActiveSubscription()
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get user subscription status
  async getSubscriptionStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const userId = (req.user as any).id;
      const status = await this.userService.getUserSubscriptionStatus(userId);
      const canAccessPremium = await this.userService.canUserAccessPremiumFeatures(userId);

      res.json({
        subscriptionStatus: status,
        canAccessPremiumFeatures: canAccessPremium
      });
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}