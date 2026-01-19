export interface EnvConfig{
  environment:string,
  port: string,
  pgHost: string,
  pgPort: string,
  pgUser: string,
  pgPassword: string,
  pgDatabase: string
}

export interface s3Config{
  s3Endpoint: string,
  s3Region:string,
  s3AccessKey:string,
  s3SecretKey:string,
  s3Bucket:string
}

export type SuffixChecker = (value:string,suffix:string) => boolean;
export type GlobalEnvironmentChecker = () => string;
export type GetEnv = (globalEnv:GlobalEnvironmentChecker, key: string) => string;
