const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
        await page.goto('http://localhost:4321/cotizaciones', { waitUntil: 'load' });
    } catch (e) {
        console.log("Could not load page:", e.message);
        process.exit(1);
    }
    
    await page.fill('#quote-pin', '9988');
    await page.click('#btn-verify-pin');
    await page.waitForTimeout(1000);
    
    const html = await page.content();
    require('fs').writeFileSync('dom_dump.html', html);
    
    // Screenshot
    await page.screenshot({ path: 'DEBUG_screenshot.png' });
    
    await browser.close();
    console.log("Done. Check dom_dump.html and DEBUG_screenshot.png");
})();
