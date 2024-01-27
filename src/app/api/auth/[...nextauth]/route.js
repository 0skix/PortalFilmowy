import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

const handler = NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: "smtp.hostinger.com",
        port: 465,
        auth: {
          user: process.env.EMAIL_USER ?? "",
          pass: process.env.EMAIL_PASSWORD ?? "",
        },
      },
      from: process.env.EMAIL_USER ?? "",
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    secret: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? "",
  }),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
