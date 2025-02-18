import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const { mutate: login, isPending } = useAuth();

  /**
   * Handle form submission
   * @param e - Form event
   *
   *
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  /**
   *
   * @param e - Input change event
   *
   *
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
      <div className="w-[344px] md:w-[414px] space-y-4 p-12 px-16 bg-black/45">
        <h1 className="text-[32px] font-medium text-white mb-2">Sign In</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-sm mb-1">
              Username: <span className="text-gray-400">( mor_2314 )</span>{' '}
            </h2>
            <Input
              type="text"
              name="username"
              required
              value={credentials.username}
              onChange={handleChange}
              placeholder="mor_2314"
              className="h-[40px] bg-[#333333] border-0 rounded-[4px] text-white placeholder:text-[#8c8c8c] text-base px-5"
            />
          </div>

          <div>
            <h2 className="text-sm mb-1">
              Password: <span className="text-gray-400">( 83r5^_ ) </span>
            </h2>
            <Input
              type="password"
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              placeholder="83r5^_"
              className="h-[40px] bg-[#333333] border-0 rounded-[4px] text-white placeholder:text-[#8c8c8c] text-base px-5"
            />
          </div>

          <Button
            type="submit"
            variant="long"
            disabled={isPending}
            className="w-full h-[40px] bg-red-600 hover:bg-red-700 text-white font-normal text-base rounded-[4px] border-0"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black/75 px-2 text-[13px] text-zinc-500">OR</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full h-[40px] bg-[#454545] hover:bg-[#4f4f4f] text-white font-normal text-base rounded-[4px] border-0"
          >
            Use a Sign-In Code
          </Button>

          <a
            href="/forgot-password"
            className="block text-[13px] text-zinc-400 hover:underline text-center mt-4"
          >
            Forgot Password?
          </a>

          <div className="flex items-center space-x-1 mt-2">
            <Checkbox
              id="remember"
              className="w-4 h-4 border-zinc-600 data-[state=checked]:bg-primary-500"
            />
            <label htmlFor="remember" className="text-[13px] font-normal text-zinc-400">
              Remember me
            </label>
          </div>

          <div className="space-y-3 mt-4">
            <p className="text-[13px] text-zinc-400">
              New to Netflix?{' '}
              <a href="/signup" className="text-white hover:underline">
                Sign up now.
              </a>
            </p>
            <p className="text-[13px] text-zinc-500 leading-tight">
              This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{' '}
              <a href="/learn-more" className="text-blue-500 hover:underline">
                Learn more.
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
