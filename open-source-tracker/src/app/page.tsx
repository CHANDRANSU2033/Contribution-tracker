"use client"

import {signIn, signOut, useSession} from "next-auth/react"
import Image from "next/image"

export default function Home() {
  const {data : session} = useSession();

  return (
    <div className="p-4 text-center">
      {session ? (
        <div>
        <p>Welcome, {session.user?.name}!</p>
        <Image
            src={session.user?.image ?? ""}
            alt="Profile"
            width={64} // Specify the width
            height={64} // Specify the height
            className="w-16 h-16 rounded-full mx-auto"
          />
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
      ):(
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => signIn("github")}>
          Sign in with GitHub
        </button>
      )}
    </div>
  )
}