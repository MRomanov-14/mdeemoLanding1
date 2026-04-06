const { chromium } = require('playwright');
(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:4321/cotizaciones', { waitUntil: 'load' });
        await page.fill('#quote-pin', '9988');
        await page.click('#btn-verify-pin');
        await page.waitForTimeout(2000);
        
        const rects = await page.evaluate(() => {
            const wrapper = document.querySelector('.calculadora-wrapper');
            const card = document.querySelector('.card');
            return {
                wrapper: wrapper ? wrapper.getBoundingClientRect() : null,
                card: card ? card.getBoundingClientRect() : null,
                wrapperStyles: wrapper ? {
                     opacity: window.getComputedStyle(wrapper).opacity,
                     height: window.getComputedStyle(wrapper).height,
                     display: window.getComputedStyle(wrapper).display,
                     color: window.getComputedStyle(wrapper).color,
                     backgroundColor: window.getComputedStyle(wrapper).backgroundColor
                } : null,
                cardStyles: card ? {
                     opacity: window.getComputedStyle(card).opacity,
                     height: window.getComputedStyle(card).height,
                     display: window.getComputedStyle(card).display,
                     top: window.getComputedStyle(card).top,
                     left: window.getComputedStyle(card).left,
                     position: window.getComputedStyle(card).position,
                     visibility: window.getComputedStyle(card).visibility,
                } : null,
                bodyHeight: document.body.scrollHeight,
                mainHeight: document.querySelector('main').scrollHeight,
            };
        });
        
        console.log(JSON.stringify(rects, null, 2));
        await browser.close();
    } catch (e) {
        console.error("ERROR", e);
    }
})();
