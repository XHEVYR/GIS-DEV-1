import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // --- HARDCODE LOGIN SEDERHANA UNTUK PKL ---
        // Username: admin, Password: 123
        if (credentials?.username === "admin" && credentials?.password === "123") {
          return { id: "1", name: "Admin Ganteng", email: "admin@gis.com" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/auth/login", // Redirect ke sini kalau belum login
  }
})

export { handler as GET, handler as POST }