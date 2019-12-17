import {promisify} from 'util';
import * as globLib from 'glob';

export const glob = promisify(globLib);