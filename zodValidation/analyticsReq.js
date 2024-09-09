import {z} from 'zod';

const analyticsReqSechema = z.object({
    districtId: z.string().optional(),
    subDistrictId: z.string().optional(),
    facilityId: z.string().optional()
})

export default analyticsReqSechema