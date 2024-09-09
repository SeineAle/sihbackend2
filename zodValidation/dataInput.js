import { z } from 'zod';

const dataSchema = z.object({
  uid: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  age: z.number().min(0), 
  sex: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.string().min(1), // active, cured, dead
  description: z.string().optional(),
});


export default dataSchema;