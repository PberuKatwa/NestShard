function getEnv(key:string): string {

    const value = process.env[key]

    if( value == ""  || value == undefined || value == null){
        throw new Error(`Cannot start without missing variable ${key}`)
    }

    return value

}

import dotenv from "dotenv";
dotenv.config();
import { EnvConfig, SuffixChecker, GlobalEnvironmentChecker } from "./types/env.types.js";


// const getGlobalEnvironment:GlobalEnvironmentChecker = function ():string {
//   try {

//     const env = process.env.ENVIRONMENT
//     if(!env) throw new Error(`No environmet was found`)
//     return env
//   } catch (error) {
//     throw error;
//   }
// }

// const hasSuffix: SuffixChecker = function (value: string, suffix: string): boolean {
//   const pattern = new RegExp(`_${suffix}$`);
//   return pattern.test(value);
// }

// const getEnv = function (
//   globalEnvCallback: GlobalEnvironmentChecker,
//   key: string
// ): string {
//   try {

//     const global = globalEnvCallback();
//     const combinedKey = `${key}_${global}`
//     const env = process.env[combinedKey]

//     if (!env) throw new Error(`No env for key:${key} was found`);
//     return env

//   } catch (error) {
//     throw error;
//   }
// }

// export const envConfig:EnvConfig = {
//   environment:getGlobalEnvironment(),
//   port: getEnv(getGlobalEnvironment,"PORT"),
//   pgHost: getEnv(getGlobalEnvironment,"PG_HOST"),
//   pgPort: getEnv(getGlobalEnvironment,"PG_PORT"),
//   pgUser: getEnv(getGlobalEnvironment,"PG_USER"),
//   pgPassword: getEnv(getGlobalEnvironment,"PG_PASSWORD"),
//   pgDatabase: getEnv(getGlobalEnvironment,"PG_DATABASE")
// }


export const config = function(){
    return{

        port:getEnv("PORT"),
        garageEndpoint: getEnv("GARAGE_ENDPOINT"),
        garageRegion:getEnv("GARAGE_REGION"),
        garageAccessKey:getEnv("GARAGE_ACCESS_KEY"),
        garageSecretKey:getEnv("GARAGE_SECRET_KEY"),
        garageBucket:getEnv("GARAGE_BUCKET")

    }
}

export default config
