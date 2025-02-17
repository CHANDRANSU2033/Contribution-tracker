import AuthProvider from '@/components/SessionProvider'
import React from 'react';

export default function RootLayout ({ children } : {children : React.ReactNode}) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}