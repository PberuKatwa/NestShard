import { GlobalEnvironmentChecker, GetEnv, EnvConfig } from "./types/env.types"

const getGlobalEnvironment: GlobalEnvironmentChecker = function (): string {
  try {

    const env = process.env.ENVIRONMENT
    if(!env) throw new Error(`No environmet was found`)
    return env
  } catch (error) {
    throw error;
  }
}

const getEnv:GetEnv = function (
  globalEnvCallback: GlobalEnvironmentChecker,
  key: string
): string {
  try {

    const global = globalEnvCallback();
    const combinedKey = `${key}_${global}`
    const env = process.env[combinedKey]

    if (!env) throw new Error(`No env for key:${key} was found`);
    return env

  } catch (error) {
    throw error;
  }
}

export const envConfig:EnvConfig = {
  environment:getGlobalEnvironment(),
  port: getEnv(getGlobalEnvironment,"PORT"),
  pgHost: getEnv(getGlobalEnvironment,"PG_HOST"),
  pgPort: getEnv(getGlobalEnvironment,"PG_PORT"),
  pgUser: getEnv(getGlobalEnvironment,"PG_USER"),
  pgPassword: getEnv(getGlobalEnvironment,"PG_PASSWORD"),
  pgDatabase: getEnv(getGlobalEnvironment, "PG_DATABASE"),
  s3Endpoint: getEnv("GARAGE_ENDPOINT"),
  s3Region:getEnv("GARAGE_REGION"),
  s3AccessKey:getEnv("GARAGE_ACCESS_KEY"),
  s3SecretKey:getEnv("GARAGE_SECRET_KEY"),
  s3Bucket:getEnv("GARAGE_BUCKET")

}




export default config
