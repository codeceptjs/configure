const Config = require('codeceptjs').config;
const { expect } = require('chai');
const { useHeadlessWhen, useSharedCookies } = require('./index');

describe('Hooks tests', () => {

  beforeEach(() => Config.reset());

  describe('#useHeadlessWhen', () => {
    it('should not enable headless when false', () => {
      const config = {
        helpers: {
          Puppeteer: {
            show: true,
          },
        },        
      }
      useHeadlessWhen(false);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.Puppeteer.show', true);
    });    
    it('should enable headless for Puppeteer', () => {
      const config = {
        helpers: {
          Puppeteer: {
            url: 'http://localhost',
            restart: false,
            windowSize: '1600x1200',
            show: true,
          },
        },        
      }
      useHeadlessWhen(true);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.Puppeteer.show', false);
    });

    it('should enable headless for WebDriver', () => {
      const config = {
        helpers: {
          WebDriver: {
            url: 'http://localhost',
            browser: 'chrome',
            restart: false,
            windowSize: '1600x1200',
          },
        },        
      }
      useHeadlessWhen(true);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.WebDriver.desiredCapabilities.chromeOptions.args[0]', '--headless');
    });
  });

  describe('#useSharedCookies', () => {
    const fn = async (request) => {
      if (!cookies) cookies = await codeceptjs.container.helpers(helper).grabCookie();
      request.headers = { Cookie: cookies.map(c => `${c.name}=${c.value}`).join('; ') };      
    }

    it('should copy cookies from WebDriver to REST', () => {
      const config = {
        helpers: {
          WebDriver: {},
          REST: {}
        },        
      }
      useSharedCookies(true);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.REST.onRequest');
      expect(Config.get().helpers.REST.onRequest.toString(), fn.toString())
    });

    it('should copy cookies from Puppeteer to GraphQL and GraphQLDataFactory', () => {
      const config = {
        helpers: {
          WebDriver: {},
          GraphQL: {},
          GraphQLDataFactory: {}
        },        
      }
      useSharedCookies(true);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.GraphQL.onRequest');
      expect(Config.get().helpers.GraphQL.onRequest.toString(), fn.toString());
      expect(Config.get()).to.have.nested.property('helpers.GraphQLDataFactory.onRequest');
      expect(Config.get().helpers.GraphQLDataFactory.onRequest.toString(), fn.toString())
    });    
  });

});