import { Controller, Get, Post, Req, Res, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { I18nService } from '../i18n/i18n.service';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private i18nService: I18nService,
  ) {}

  @Get('/')
  async loginPage(@Req() req, @Res() res, @Query('lng') language?: string) {
    if (req.session.user) return res.redirect('/welcome');
    
    // Set language if provided, default to Russian
    const lang = language || 'ru';
    this.i18nService.setLanguage(lang);
    
    // Load template and render with translations
    const templatePath = path.join(process.cwd(), 'src', 'views', 'login.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    
    const translations = this.i18nService.getAllTranslations(lang);
    
    const html = template({
      lang,
      t: translations
    });
    
    res.send(html);
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
  async welcome(@Req() req, @Res() res, @Query('lng') language?: string) {
    if (!req.session.user) return res.redirect('/');
    
    // Get user's preferred language from database, fallback to URL parameter, then Russian
    let lang = 'ru';
    if (language) {
      lang = language;
    } else {
      const userSettings = await this.userService.getUserSettings(req.session.user);
      lang = userSettings.language || 'ru';
    }
    
    this.i18nService.setLanguage(lang);
    
    // Load template and render with translations
    const templatePath = path.join(process.cwd(), 'src', 'views', 'welcome.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    
    const translations = this.i18nService.getAllTranslations(lang);
    
    const html = template({
      lang,
      t: translations
    });
    
    res.send(html);
  }

  @Get('/settings')
  async settings(@Req() req, @Res() res, @Query('lng') language?: string) {
    if (!req.session.user) return res.redirect('/');
    
    // Get user's preferred language from database, fallback to URL parameter, then Russian
    let lang = 'ru';
    if (language) {
      lang = language;
    } else {
      const userSettings = await this.userService.getUserSettings(req.session.user);
      lang = userSettings.language || 'ru';
    }
    
    this.i18nService.setLanguage(lang);
    
    // Load template and render with translations
    const templatePath = path.join(process.cwd(), 'src', 'views', 'settings.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    
    const translations = this.i18nService.getAllTranslations(lang);
    const availableLanguages = this.i18nService.getAvailableLanguages();
    
    const html = template({
      lang,
      t: translations,
      languages: availableLanguages
    });
    
    res.send(html);
  }

  @Post('/settings/language')
  async updateLanguage(@Body() body, @Req() req, @Res() res) {
    if (!req.session.user) return res.redirect('/');
    
    const { language } = body;
    if (language) {
      // Update user settings in database
      await this.userService.updateUserSettings(req.session.user, { language });
    }
    
    res.redirect(`/settings?lng=${language}`);
  }

  @Get('/logout')
  logout(@Req() req, @Res() res) {
    req.session.destroy(() => res.redirect('/'));
  }

  @Get('/api/translations')
  getTranslations(@Query('lng') language: string = 'ru') {
    this.i18nService.setLanguage(language);
    return this.i18nService.getAllTranslations(language);
  }

  @Get('/api/languages')
  getLanguages() {
    return this.i18nService.getAvailableLanguages();
  }
}
