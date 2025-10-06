import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { RegisterData } from '../../types/user';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      addNotification({
        type: 'success',
        title: 'Welcome to Bookiez!',
        message: 'Your account has been created successfully.',
      });
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-cf-dark-red hover:text-red-700"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                autoComplete="given-name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                })}
              />

              <Input
                label="Last Name"
                autoComplete="family-name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                })}
              />
            </div>

            <Input
              label="Username"
              autoComplete="username"
              placeholder="johndoe"
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              })}
            />

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-cf-dark-red focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-cf-dark-red hover:text-red-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-cf-dark-red hover:text-red-700">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
