'use client'

import { useEffect, useState } from 'react'

export function PasswordStrength({ password }: { password: string }) {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    let score = 0
    if (password.length >= 8) score++
    if (password.match(/[A-Z]/)) score++
    if (password.match(/[0-9]/)) score++
    if (password.match(/[^A-Za-z0-9]/)) score++
    setStrength(score)
  }, [password])

  return (
    <div className="mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-sm ${
              i <= strength
                ? strength >= 3
                  ? 'bg-green-500'
                  : strength >= 2
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {strength === 0 && 'Very weak'}
        {strength === 1 && 'Weak'}
        {strength === 2 && 'Moderate'}
        {strength === 3 && 'Strong'}
        {strength === 4 && 'Very strong'}
      </p>
    </div>
  )
}