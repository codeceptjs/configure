const assert = require('assert');

Feature('Demo');

Scenario('Open a page', async (I) => {
  I.amOnPage('https://github.com');
  pause();
  const width = await I.executeScript(() => window.innerWidth);
  const height = await I.executeScript(() => window.innerHeight);
  assert.equal(1500, width, 'width');
  assert.equal(800, height, 'height');
});
