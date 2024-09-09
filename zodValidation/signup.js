import { z } from 'zod';

const userSignupSchema = z.object({
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(10),
    districtId: z.string().optional(),
    subDistrictId: z.string().optional(),
    facilityId: z.string().optional(),
    otp: z.string().optional(),
    otpExpiry: z.string().optional(),

  });

export default userSignupSchema;