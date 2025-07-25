import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  loginPage(@Req() req, @Res() res) {
    if (req.session.user) return res.redirect('/welcome');
    res.sendFile('login.html', { root: 'src/views' });
  }

  @Post('/login')
  async login(@Body() body, @Req() req, @Res() res) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (user) {
      req.session.user = user.username;
      return res.redirect('/welcome');
    }
    // Redirect back to login with error parameter
    res.redirect('/?error=invalid');
  }

  @Get('/welcome')
  welcome(@Req() req, @Res() res) {
    if (!req.session.user) return res.redirect('/');
    res.sendFile('welcome.html', { root: 'src/views' });
  }

  @Get('/logout')
  logout(@Req() req, @Res() res) {
    req.session.destroy(() => res.redirect('/'));
  }
}
