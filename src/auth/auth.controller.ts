import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { LocalAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: AuthDto) {
    return this._authService.signUp(dto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() dto: AuthDto) {
    return this._authService.signIn(dto);
  }

  @Get('protected')
  async protected() {
    return { message: 'protected' };
  }

  @Get('test-session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log('session', session);
    console.log('session.id', session.id);
    session.authenticated = true;
    return session;
  }

  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
