import { launch } from 'puppeteer';

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto('http://ladislavprix.cz');
  page.setViewport({ width: 500, height: 950 });
  await page.pdf({ path: 'a.pdf' });
  await page.screenshot({ path: 'screenshot.png' });
  await page.close();
  await browser.close();
})();
