import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// In a real application, you would manage these in process.env, 
// e.g. process.env.ADMIN_1_USER, process.env.ADMIN_1_PASS
const ADMIN_USERS = [
  {
    username: process.env.ADMIN_USER_1 || "shreeumiya",
    password: process.env.ADMIN_PASS_1 || "admin123", // You should use strong hashed passwords ideally or very secure environment variables
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const admin = ADMIN_USERS.find(
          (user) =>
            user.username === credentials.username &&
            user.password === credentials.password
        );

        if (admin) {
          return { id: "admin-1", name: admin.username };
        } else {
          return null;
        }
      },
    }),
  ],
  // No custom pages — signIn() from next-auth/react will POST to /api/auth/callback/credentials
  // The middleware handles redirecting users to our custom /admin/login UI
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
