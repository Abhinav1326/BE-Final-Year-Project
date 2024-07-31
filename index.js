const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto('https://internshala.com/');
    await page.waitForSelector("#modal_login_submit");
    await page.click(".login-cta");
    await page.type("#modal_email", "abhinavgore.sit.it@gmail.com");
    await page.type("#modal_password", "Abhinav@1326");
    await page.click("#modal_login_submit");


    await page.waitForNavigation({waitUntil : "networkidle2"});
    await page.click(".internship_link");


    await page.waitForNavigation({waitUntil : "networkidle2"});
    await page.type(".chosen-search-input", "Web Development");
    let profile_options = await page.$$(".active-result");
    console.log(profile_options);


    await page.screenshot({ path: 'wiki.png' });
    await browser.close();
})();
