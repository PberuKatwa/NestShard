import { logger } from "./logger";

export const APP_LOGGER = 'APP_LOGGER';

export const loggerProvider = {
    provide:APP_LOGGER,
    useValue:logger
}