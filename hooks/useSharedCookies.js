const Config = require('codeceptjs').config;

module.exports = function() {
  const browserHelpers = ['WebDriver','Protractor','Puppeteer','TestCafe','Nigthmare'];
  Config.addHook((config) => {
    const helper = detectBrowserHelper(config.helpers);
    let cookies;
    const shareCookiesFn = async (request) => {
      if (!cookies) cookies = await codeceptjs.container.helpers(helper).grabCookie();
      request.headers = { Cookie: cookies.map(c => `${c.name}=${c.value}`).join('; ') };      
    }
    if (config.helpers.REST) {
      config.helpers.REST.onRequest = shareCookiesFn;
    }
    if (config.helpers.ApiDataFactory) {
      config.helpers.ApiDataFactory.onRequest = shareCookiesFn;
    }
    if (config.helpers.GraphQL) {
      config.helpers.GraphQL.onRequest = shareCookiesFn;
    }
    if (config.helpers.GraphQLDataFactory) {
      config.helpers.GraphQLDataFactory.onRequest = shareCookiesFn;
    }
  });
  
  function detectBrowserHelper(helperConfig) {
    if (!helperConfig) return false;
    for (const helper of browserHelpers) {
      if (Object.keys(helperConfig).indexOf(helper) >= 0) return helper;
    }
  }
}
