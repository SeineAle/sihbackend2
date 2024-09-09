import { z } from 'zod';

const userSigninSchema = z.object({
    userId: z.string(),
    password: z.string().min(6).max(10),
  });

export default userSigninSchema