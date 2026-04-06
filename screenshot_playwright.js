const { chromium } = require('playwright');
(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:4321/cotizaciones', { waitUntil: 'load' });
        await page.fill('#quote-pin', '9988');
        await page.click('#btn-verify-pin');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: '/Users/hunsjov/.gemini/antigravity/brain/9c43fa94-d112-4f2b-8de0-8d277cf2968d/artifacts/test_screenshot.png' });
        await browser.close();
        console.log("Screenshot taken.");
    } catch (e) {
        console.error("ERROR", e);
    }
})();
