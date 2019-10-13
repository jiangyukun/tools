import {getEnv} from './env';
import {build} from './generateIcons';

export function buildIcon(options: { dirname: string }) {
    build(getEnv(options))
}


