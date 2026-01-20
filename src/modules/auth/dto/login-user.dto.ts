import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class LoginUserDto{

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8, { message: 'Password or email is incorrect' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'Password or email is incorrect' }
  )
  password: string;

}
