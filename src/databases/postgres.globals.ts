import { Injectable } from "@nestjs/common";
import { PostgresConfig } from "./postgres.config";

@Injectable()
export class PostgresGlobals{

  constructor(private readonly pgConfig: PostgresConfig) { };

  async initializeTypes() {
    try {

    } catch(error) {

    }
  }

}
