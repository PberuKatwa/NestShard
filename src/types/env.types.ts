export interface EnvConfig{
  environment:string,
  port: string,
  pgHost: string,
  pgPort: string,
  pgUser: string,
  pgPassword: string,
  pgDatabase: string
}

export type SuffixChecker = (value:string,suffix:string) => boolean;
export type GlobalEnvironmentChecker = () => string;
export type GetEnv = (globalEnv:GlobalEnvironmentChecker, key: string) => string;
