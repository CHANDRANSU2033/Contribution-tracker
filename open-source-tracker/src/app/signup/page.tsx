import { SignUp } from "@/components/auth/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title : "Sign Up"
}

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <SignUp/>
        </div>
    )
}