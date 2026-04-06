const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/cotizaciones', { waitUntil: 'load' });
    
    // Type 9988 and verify
    await page.fill('#quote-pin', '9988');
    await page.click('#btn-verify-pin');
    
    // Wait slightly
    await page.waitForTimeout(1000);
    
    const isVisible = await page.evaluate(() => {
        const el = document.getElementById('content-9988');
        if (!el) return 'NOT_FOUND';
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        return {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            width: rect.width,
            height: rect.height,
            textLength: el.innerText.length
        };
    });
    
    console.log("Calculadora stats:", isVisible);
    
    await browser.close();
})();
