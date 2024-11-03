declare module '#auth-utils' {
  interface User {
    email: string
    sub: string
    email_verified: boolean
  }
}

export {}