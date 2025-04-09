// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        id : string;
        user: {
            id: string;
            accounts: Array<{
              provider: string;
              username: string;
            }>;
          };
    }
}