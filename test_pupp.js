const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/cotizaciones', { waitUntil: 'load' });
    
    // Type 9988 and submit
    await page.fill('#quote-pin', '9988');
    await page.click('#btn-verify-pin');
    
    // Wait for something inside the calculator
    await page.waitForTimeout(2000); 
    
    // Take a screenshot
    await page.screenshot({ path: '/tmp/test_shoot.png' });
    
    await browser.close();
})();
