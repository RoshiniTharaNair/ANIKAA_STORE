// next-auth.d.ts

import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** The user's unique id. */
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    /** The user's unique id. */
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's unique id. */
    sub: string;
  }
}
