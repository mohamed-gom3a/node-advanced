const puppeteer = require('puppeteer');

test('launch browser test',async () =>  {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

})