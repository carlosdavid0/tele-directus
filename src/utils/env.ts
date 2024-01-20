import { z } from 'zod'


const envSchema = z.object({
    BOT_TOKEN: z.string(),
    USER_BOT_DIRECTUS_TOKEN: z.string(),
    DIRECTUS_BASE_URL: z.string().url()
})

export const env = envSchema.parse(process.env)

