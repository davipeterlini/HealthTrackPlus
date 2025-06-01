// Custom Hook - User Service (following Clean Architecture)
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../../domain/entities/User';
import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

// Singleton pattern for service instance
let userServiceInstance: UserService | null = null;

const getUserService = (): UserService => {
  if (!userServiceInstance) {
    const userRepository = new UserRepository();
    userServiceInstance = new UserService(userRepository);
  }
  return userServiceInstance;
};

export const useUserService = () => {
  const queryClient = useQueryClient();
  const userService = getUserService();

  // Get current user query
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) return false;
      return failureCount < 3;
    }
  });

  // Get user display info
  const displayInfoQuery = useQuery({
    queryKey: ['user', 'display-info'],
    queryFn: () => userService.getUserDisplayInfo(),
    enabled: !!userQuery.data,
    staleTime: 5 * 60 * 1000
  });

  // Get subscription status
  const subscriptionQuery = useQuery({
    queryKey: ['user', 'subscription'],
    queryFn: () => userService.getSubscriptionStatus(),
    enabled: !!userQuery.data,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: { name?: string; avatar?: string }) =>
      userService.updateUserProfile(userData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user', 'display-info'] });
    }
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: (subscriptionData: {
      stripeSubscriptionId: string;
      subscriptionStatus: string;
      subscriptionEndDate?: Date;
    }) => userService.updateSubscription(subscriptionData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user', 'subscription'] });
    }
  });

  // Check premium access
  const checkPremiumAccess = async (): Promise<boolean> => {
    try {
      return await userService.checkPremiumAccess();
    } catch (error) {
      console.error('Error checking premium access:', error);
      return false;
    }
  };

  return {
    // Data
    user: userQuery.data,
    displayInfo: displayInfoQuery.data,
    subscription: subscriptionQuery.data,
    
    // Loading states
    isLoading: userQuery.isLoading,
    isDisplayInfoLoading: displayInfoQuery.isLoading,
    isSubscriptionLoading: subscriptionQuery.isLoading,
    
    // Error states
    error: userQuery.error,
    displayInfoError: displayInfoQuery.error,
    subscriptionError: subscriptionQuery.error,
    
    // Authentication state
    isAuthenticated: !!userQuery.data && !userQuery.error,
    isUnauthenticated: userQuery.error?.status === 401,
    
    // Actions
    updateProfile: updateProfileMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
    checkPremiumAccess,
    
    // Mutation states
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingSubscription: updateSubscriptionMutation.isPending,
    
    // Refetch functions
    refetchUser: userQuery.refetch,
    refetchSubscription: subscriptionQuery.refetch
  };
};