import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import {
  AccessTokenGuard,
  CurrentPrincipal,
} from "./guards/access-token.guard.js";
import type { AuthPrincipal } from "./session/auth-principal.js";
import { AccessCookieService } from "./session/access-cookie.service.js";
import type { SafeUser } from "../users/safe-user.js";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { SignUpDto } from "./dto/sign-up.dto.js";

@Controller("auth")
export class AuthController {
  public constructor(
    private readonly auth: AuthService,
    private readonly cookies: AccessCookieService,
  ) {}

  @Post("sign-up")
  @HttpCode(HttpStatus.CREATED)
  public async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    readonly messageCode: "AUTH_SIGN_UP_SUCCEEDED";
    readonly user: SafeUser;
  }> {
    const session = await this.auth.signUp(dto);
    response.setHeader("Set-Cookie", this.cookies.set(session.accessToken));
    return { messageCode: "AUTH_SIGN_UP_SUCCEEDED", user: session.user };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ readonly user: SafeUser }> {
    const session = await this.auth.login(dto);
    response.setHeader("Set-Cookie", this.cookies.set(session.accessToken));
    return { user: session.user };
  }

  @Get("me")
  @UseGuards(AccessTokenGuard)
  public me(@CurrentPrincipal() principal: AuthPrincipal): Promise<SafeUser> {
    return this.auth.currentUser(principal.userId);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({ passthrough: true }) response: Response): void {
    response.setHeader("Set-Cookie", this.cookies.clear());
  }
}
