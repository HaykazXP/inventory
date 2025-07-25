import { Controller, Get, Post, Body, Param, Patch, Delete, Redirect, HttpException, HttpStatus, Req, Res, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { UserService } from '../user/user.service';
import { I18nService } from '../i18n/i18n.service';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly i18nService: I18nService,
  ) {}

  @Get()
  async list(@Req() req, @Res() res, @Query('lng') language?: string) {
    // Check authentication
    if (!req.session.user) return res.redirect('/');
    
    try {
      // Get user's preferred language from database, fallback to URL parameter, then Russian
      let lang = 'ru';
      if (language) {
        lang = language;
      } else {
        const userSettings = await this.userService.getUserSettings(req.session.user);
        lang = userSettings.language || 'ru';
      }
      
      this.i18nService.setLanguage(lang);
      
      // Get products data
      const products = await this.productService.findAll();
      
      // Register Handlebars helpers
      Handlebars.registerHelper('formatPrice', function(price) {
        if (!price || isNaN(price)) return '0.00';
        return parseFloat(price).toFixed(2);
      });
      
      Handlebars.registerHelper('objectLength', function(obj) {
        if (!obj || typeof obj !== 'object') return 0;
        return Object.keys(obj).length;
      });
      
      Handlebars.registerHelper('formatDate', function(date) {
        if (!date) return 'N/A';
        try {
          const d = new Date(date);
          if (isNaN(d.getTime())) return 'N/A';
          return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        } catch (error) {
          return 'N/A';
        }
      });
      
      Handlebars.registerHelper('gt', function(a, b) {
        return a > b;
      });
      
      Handlebars.registerHelper('eq', function(a, b) {
        return a === b;
      });
      
      // Register partials
      const sidebarPartialPath = path.join(process.cwd(), 'src', 'views', 'components', 'sidebar.html');
      const sidebarPartialContent = fs.readFileSync(sidebarPartialPath, 'utf8');
      Handlebars.registerPartial('components/sidebar', sidebarPartialContent);
      
      const stylesPartialPath = path.join(process.cwd(), 'src', 'views', 'components', 'styles.html');
      const stylesPartialContent = fs.readFileSync(stylesPartialPath, 'utf8');
      Handlebars.registerPartial('components/styles', stylesPartialContent);
      
      // Load products template
      const productsTemplatePath = path.join(process.cwd(), 'src', 'views', 'products.html');
      const productsTemplateContent = fs.readFileSync(productsTemplatePath, 'utf8');
      const productsTemplate = Handlebars.compile(productsTemplateContent);
      
      // Load base layout template
      const layoutTemplatePath = path.join(process.cwd(), 'src', 'views', 'layouts', 'base.html');
      const layoutTemplateContent = fs.readFileSync(layoutTemplatePath, 'utf8');
      const layoutTemplate = Handlebars.compile(layoutTemplateContent);
      
      const translations = this.i18nService.getAllTranslations(lang);
      
      // Render products content
      const productsContent = productsTemplate({
        lang,
        t: translations,
        products: products || [],
        error: null
      });
      
      // Render full page with layout
      const html = layoutTemplate({
        lang,
        t: translations,
        pageTitle: 'Products Management',
        currentPage: 'products',
        body: productsContent
      });
      
      res.send(html);
    } catch (error) {
      console.error('Error in products list:', error);
      
      // Handle error case
      let lang = 'ru';
      if (language) {
        lang = language;
      } else if (req.session.user) {
        try {
          const userSettings = await this.userService.getUserSettings(req.session.user);
          lang = userSettings.language || 'ru';
        } catch (e) {
          // Fallback to Russian
        }
      }
      
      this.i18nService.setLanguage(lang);
      
      // Register Handlebars helpers
      Handlebars.registerHelper('formatPrice', function(price) {
        if (!price || isNaN(price)) return '0.00';
        return parseFloat(price).toFixed(2);
      });
      
      Handlebars.registerHelper('objectLength', function(obj) {
        if (!obj || typeof obj !== 'object') return 0;
        return Object.keys(obj).length;
      });
      
      Handlebars.registerHelper('formatDate', function(date) {
        if (!date) return 'N/A';
        try {
          const d = new Date(date);
          if (isNaN(d.getTime())) return 'N/A';
          return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        } catch (error) {
          return 'N/A';
        }
      });
      
      Handlebars.registerHelper('gt', function(a, b) {
        return a > b;
      });
      
      Handlebars.registerHelper('eq', function(a, b) {
        return a === b;
      });
      
      // Register partials
      const sidebarPartialPath = path.join(process.cwd(), 'src', 'views', 'components', 'sidebar.html');
      const sidebarPartialContent = fs.readFileSync(sidebarPartialPath, 'utf8');
      Handlebars.registerPartial('components/sidebar', sidebarPartialContent);
      
      const stylesPartialPath = path.join(process.cwd(), 'src', 'views', 'components', 'styles.html');
      const stylesPartialContent = fs.readFileSync(stylesPartialPath, 'utf8');
      Handlebars.registerPartial('components/styles', stylesPartialContent);
      
      // Load products template
      const productsTemplatePath = path.join(process.cwd(), 'src', 'views', 'products.html');
      const productsTemplateContent = fs.readFileSync(productsTemplatePath, 'utf8');
      const productsTemplate = Handlebars.compile(productsTemplateContent);
      
      // Load base layout template
      const layoutTemplatePath = path.join(process.cwd(), 'src', 'views', 'layouts', 'base.html');
      const layoutTemplateContent = fs.readFileSync(layoutTemplatePath, 'utf8');
      const layoutTemplate = Handlebars.compile(layoutTemplateContent);
      
      const translations = this.i18nService.getAllTranslations(lang);
      
      // Render products content
      const productsContent = productsTemplate({
        lang,
        t: translations,
        products: [],
        error: 'Failed to load products: ' + error.message
      });
      
      // Render full page with layout
      const html = layoutTemplate({
        lang,
        t: translations,
        pageTitle: 'Products Management',
        currentPage: 'products',
        body: productsContent
      });
      
      res.send(html);
    }
  }

  @Post()
  @Redirect('/products')
  async create(@Body() body: Partial<Product>, @Req() req, @Res() res) {
    // Check authentication
    if (!req.session.user) return res.redirect('/');
    
    try {
      const { name, price } = body;
      if (!name || !price) {
        throw new HttpException('Name and price are required', HttpStatus.BAD_REQUEST);
      }
      
      const numericPrice = parseFloat(price as any);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new HttpException('Invalid price', HttpStatus.BAD_REQUEST);
      }

      await this.productService.create({
        name: name.toString().trim(),
        price: numericPrice
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create product', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async get(@Param('id') id: string, @Req() req, @Res() res) {
    // Check authentication
    if (!req.session.user) return res.redirect('/');
    
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get product', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Product>, @Req() req, @Res() res) {
    // Check authentication
    if (!req.session.user) return res.redirect('/');
    
    try {
      return await this.productService.update(id, body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update product', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    // Check authentication
    if (!req.session.user) return res.redirect('/');
    
    try {
      await this.productService.remove(id);
      return { success: true };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete product', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/price')
  @Redirect('/products')
  async updatePrice(@Param('id') id: string, @Body() body: { price: number }, @Req() req, @Res() res) {
    // Check authentication
    if (!req.session.user) return res.redirect('/');
    
    try {
      const { price } = body;
      if (!price || price <= 0) {
        throw new HttpException('Valid price is required', HttpStatus.BAD_REQUEST);
      }

      await this.productService.updatePrice(id, price);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update price', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/history')
  async getPriceHistory(@Param('id') id: string, @Req() req, @Res() res) {
    // Check authentication
    if (!req.session.user) return res.redirect('/');
    
    try {
      return await this.productService.getPriceHistory(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get price history', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 