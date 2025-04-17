import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function WelcomeHeader() {
    const session = await getServerSession(authOptions);


    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">
                Welcome back, {session?.user?.accounts[0]?.username || 'Contributor'}!
            </h1>

            <p className="text-gray-600 mt-2">
                Track your open-source impact across platform
            </p>
        </div>
    )
}