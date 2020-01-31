const { container, config, event } = require('../codeceptjs');

module.exports = function() {
  const browserHelpers = ['WebDriver','Protractor','Puppeteer','TestCafe','Nigthmare'];
  config.addHook(cfg => {
    const helper = detectBrowserHelper(cfg.helpers);
    let cookies;
    const shareCookiesFn = async (request) => {
      if (!cookies) cookies = await container.helpers(helper).grabCookie();
      request.headers = { ...request.headers, Cookie: cookies.map(c => `${c.name}=${c.value}`).join('; ') };      
    }
    if (cfg.helpers.REST) {
      cfg.helpers.REST.onRequest = shareCookiesFn;
    }
    if (cfg.helpers.ApiDataFactory) {
      cfg.helpers.ApiDataFactory.onRequest = shareCookiesFn;
    }
    if (cfg.helpers.GraphQL) {
      cfg.helpers.GraphQL.onRequest = shareCookiesFn;
    }
    if (cfg.helpers.GraphQLDataFactory) {
      cfg.helpers.GraphQLDataFactory.onRequest = shareCookiesFn;
    }
    event.dispatcher.on(event.test.finished, () => {
      cookies = null;
    });    
  });
  
  function detectBrowserHelper(helperConfig) {
    if (!helperConfig) return false;
    for (const helper of browserHelpers) {
      if (Object.keys(helperConfig).indexOf(helper) >= 0) return helper;
    }
  }
}
