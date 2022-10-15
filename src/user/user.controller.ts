import { Controller, Get, Request, Session, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req, @Session() session: Record<string, any>) {
    // console.log('req', req);
    // console.log('session', session);
    console.log('session', session.id);
    return req.user;
  }
}
