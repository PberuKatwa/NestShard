import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { AuthUser, BaseUser, DecodedUser, User, UserPayload } from "src/types/users.types";

@Injectable()
export class UsersModel{
  private readonly pool: Pool | null;

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly pgConfig: PostgresConfig,
    private readonly jwtService: JwtService,
    private readonly configService:ConfigService
  ) { }

  async createTable():Promise<string> {
    try {

      this.logger.warn(`Attempting to create users table`)

      const query = `
        CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          file_id INTEGER,
          password VARCHAR NOT NULL,
          access_token TEXT,
          status row_status DEFAULT 'active',
          role user_role DEFAULT 'demo',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY(file_id)
            REFERENCES files(id)
            ON DELETE SET NULL
        );

        DROP TRIGGER IF EXISTS update_users_timestamp ON users;

        CREATE TRIGGER update_users_timestamp
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION set_timestamp();

      `;

      const pgPool = this.pgConfig.getPool();
      await pgPool.query(query);
      this.logger.info(`Successfully created users table`);

      return "users";

    } catch (error) {
      throw error;
    }
  }

  async createUser( payload:UserPayload ):Promise<BaseUser> {
    try {

      const { first_name, last_name, email, password } = payload;

      this.logger.warn(`Atttempting to create user with name:${first_name}.`);
      const hashedPassword = await bcrypt.hash(password, 10)

      const query = `
        INSERT INTO users ( first_name, last_name, email, password )
        VALUES( $1, $2, $3, $4 )
        RETURNING first_name;
      `

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query, [first_name, last_name, email.toLowerCase(), hashedPassword ]);
      const user:BaseUser = result.rows[0]

      this.logger.info(`Successfully created user`);

      return user

    } catch (error) {
      throw error;
    }
  }

  async validateUserPassword(email: string, password: string): Promise<AuthUser> {
    try {

      const query = `SELECT id, email, first_name, password FROM users WHERE email =$1;`;

      const pgPool = this.pgConfig.getPool()
      const result = await pgPool.query(query, [email])
      const user = result.rows[0];

      if (!user) throw new Error(`Invalid email or password`)
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new Error(`Invalid password`);

      const payload = {
        userId:user.id,
        userName: user.first_name,
        email:email
      }

      const token = this.jwtService.sign(payload)

      const updateResult = await pgPool.query(
        `UPDATE users SET access_token=$1 WHERE id=$2
        RETURNING id, first_name, last_name, email, file_id, access_token; `,
        [ token, user.id ]
      )

      const updatedUser:User = updateResult.rows[0]

      return updatedUser;

    } catch (error) {
      throw error;
    }
  }

  async validateToken(token: string): Promise<DecodedUser> {
    try {

      const pgPool = this.pgConfig.getPool();
      const user = await pgPool.query(` SELECT access_token FROM users WHERE access_token=$1;`, [token])

      if (user.rowCount === 0 ) {
        throw new Error(`No access token was found.`)
      }

      const decoded:DecodedUser = this.jwtService.verify(token, {
        secret:this.configService.get<string>('jwtSecret')
      })

      return decoded;

    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, firstName: string, lastName: string, email: string):Promise<User> {
    try {

      this.logger.warn(`Attempting to update user with id:${id}`);

      const query = ` UPDATE users SET first_name=$1, last_name=$2, email=$3
                      WHERE id=$4 RETURNING id, first_name, last_name, email, image_url;`

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query, [firstName, lastName, email, id]);
      const user: User = result.rows[0];

      this.logger.info(`Successfully updated user with id ${id}`);

      return user;

    } catch (error) {
      throw error;
    }
  }

  async fetchUser(id: number): Promise<User> {
    try {
      this.logger.warn(`Atempting to fetch user`);

      const query = `SELECT id, first_name, last_name, email, image_url FROM users WHERE id=$1`;
      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query, [id]);
      const user: User = result.rows[0];

      return user;

    } catch (error) {
      throw error;
    }

  }

}
