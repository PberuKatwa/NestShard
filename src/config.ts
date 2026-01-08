function getEnv(key:string): string {

    const value = process.env[key]

    if( value == ""  || value == undefined || value == null){
        throw new Error(`Cannot start without missing variable ${key}`)
    }

    return value

}

export const config = {
    PORT:getEnv("PORT"),
    GARAGE_ENDPOINT:getEnv("GARAGE_ENDPOINT"),
    GARAGE_ACCESS_KEY:getEnv("GARAGE_ACCESS_KEY"),
    GARAGE_SECRET_KEY:getEnv("GARAGE_SECRET_KEY")
}