import * as path from 'path'

import {getEnv} from './env';
import {build} from './generateIcons';

export default function buildIcon(options: { src: string, dist: string }) {
    build(getEnv(options))
}


// buildIcon({
//     src: path.join(__dirname, '../../svg'),
//     dist: path.join(__dirname, '../../dist')
// })
