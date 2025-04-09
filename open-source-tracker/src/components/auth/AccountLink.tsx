'use client'

import { Button } from "../ui/button";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

export function GithubAccountLink() {
    const handleConnect = async () => {
        try {
            await signIn('github', {
                callbackUrl: '/api/auth/callback/github',
            });
        } catch (error) {
            console.error("Error connecting GitHub account:", error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <Button 
          variant="outline" 
          onClick={handleConnect}
          className="flex items-center gap-2"
        >
          <Github className="h-4 w-4" />
          Connect GitHub Account
        </Button>
    );
}