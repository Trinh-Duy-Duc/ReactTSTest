import { envRepo } from "@repo/env";
import { DevMode } from "@repo/types/enum";
import { z } from 'zod';

const mode = (import.meta.env.MODE || DevMode.Dev) as DevMode;

const appEnvSchema = z.object({
    
});

const env = {
    ...envRepo,
    ...appEnvSchema.parse(import.meta.env),
    devMode: mode
}

export default env;