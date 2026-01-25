import { Injectable } from "@nestjs/common";
import { PostgresConfig } from "./postgres.config";

@Injectable()
export class PostgresGlobals{

  constructor(private readonly pgConfig: PostgresConfig) { };

  async initializeTypes() {
    try {

      const query = `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'row_status') THEN
                CREATE TYPE property_status AS ENUM ('active', 'trash', 'pending' );
            END IF;
        END
        $$;

        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                CREATE TYPE property_status AS ENUM ('super_admin', 'admin', 'ordinary' );
            END IF;
        END
        $$;
      `;

    } catch(error) {
      throw error;
    }
  }

}
