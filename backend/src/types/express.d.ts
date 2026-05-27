import type { AuthType } from "../generated/prisma/enums.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      password: string | null;
      image: string | null;
      AuthType: AuthType | null;
      authId: string | null;
    }
  }
}
