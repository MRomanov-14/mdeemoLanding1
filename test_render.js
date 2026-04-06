import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:4321/cotizaciones', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log("Body length:", content.length);
  
  await browser.close();
})();
