function getEnv(key:string): string {

    const value = process.env[key]

    if( value == ""  || value == undefined || value == null){
        throw new Error(`Cannot start without missing variable ${key}`)
    }

    return value

}

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
