const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:4321/cotizaciones', { waitUntil: 'load' });
    await page.fill('#quote-pin', '9988');
    await page.click('#btn-verify-pin');
    await page.waitForTimeout(1000);
    
    // Let's get the bounding box of the card and wrapper
    const rects = await page.evaluate(() => {
        const wrapper = document.querySelector('.calculadora-wrapper');
        const card = document.querySelector('.card');
        return {
            wrapper: wrapper ? wrapper.getBoundingClientRect() : null,
            card: card ? card.getBoundingClientRect() : null,
            wrapperStyles: wrapper ? {
                 opacity: window.getComputedStyle(wrapper).opacity,
                 height: window.getComputedStyle(wrapper).height,
                 display: window.getComputedStyle(wrapper).display
            } : null,
            cardStyles: card ? {
                 opacity: window.getComputedStyle(card).opacity,
                 height: window.getComputedStyle(card).height,
                 display: window.getComputedStyle(card).display
            } : null
        };
    });
    
    console.log(JSON.stringify(rects, null, 2));
    await browser.close();
})();
