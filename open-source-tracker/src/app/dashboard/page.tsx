import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    
    if(!session) {
        return <p>You need to sign in to access the dashboard.</p>
    }

    return <div>Welcome to your dashboard, {session.user?.name}! </div>
}
