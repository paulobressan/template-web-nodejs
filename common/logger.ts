import * as pino from 'pino';
import { environment } from '../common/environment';

export const logger = pino({
	name: environment.log.name,
	level: environment.log.level
})