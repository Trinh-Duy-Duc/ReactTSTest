import { DevMode } from '@repo/types/enum';
import envDev from './environment.dev';
import envBeta from './environment.beta';
import envProd from './environment.prod';
import envSchema from './env.schema';

const isDevModeEnum = (value: string): value is DevMode => {
    return Object.values(DevMode).includes(value as DevMode);
}

const _nodeEnv = process.env.NODE_ENV || DevMode.Dev;
const _devMode = isDevModeEnum(_nodeEnv) ? _nodeEnv : DevMode.Dev;

let envRepo = envDev;
switch(_devMode){
    case DevMode.Dev:
        envRepo = envDev;
        break;
    case DevMode.Beta:
        envRepo = envBeta;
        break;
    case DevMode.Production:
        envRepo = envProd;
        break;
}

export { envRepo, envSchema };