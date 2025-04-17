'use client'

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordStrength } from "./PasswordStrength";
import { Loader2, AlertCircle,Eye, EyeOff  } from "lucide-react";

export function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email, password, name })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'SignUp Failed');
            }

            router.push('/signin?success=account_created');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
                Create Account
            </h1>

            {error && (
                <div
                    className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900/20 dark:text-red-200"
                    role="alert"
                    aria-live="assertive"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
                aria-busy={isLoading}
            >
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <div className="relative">
    <Input
        id="password"
        type={isPasswordVisible ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        className="w-full"
        minLength={6}
    />
    <button
        type="button"
        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
    >
        {isPasswordVisible ? (
            <EyeOff className="w-5 h-5" />
        ) : (
            <Eye className="w-5 h-5" />
        )}
    </button>
</div>
                    <PasswordStrength password={password} />
                </div>

                <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 border-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </Button>
            </form>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                    href="/signin"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}