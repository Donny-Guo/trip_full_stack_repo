import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsString({ message: "EMAIL_MUST_BE_STRING" })
  email!: string;

  @IsString({ message: "PASSWORD_MUST_BE_STRING" })
  @IsNotEmpty({ message: "PASSWORD_REQUIRED" })
  password!: string;
}
