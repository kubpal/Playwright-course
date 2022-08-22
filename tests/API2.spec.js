// Login UI -> .json
// test browser, cart, order, orderdetails, orderhistory

const {test, expect} = require('@playwright/test');
let webContext;
test.beforeAll(async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const email = "lana@del.rey";
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Testy1!2@");
    await page.locator("#login").click();
    await page.waitForLoadState("networkidle");
    await context.storageState({path: 'state.json'});
    webContext = await browser.newContext({storageState:'state.json'});
})
test.only("Client App login", async ()=>
{
    const email = "lana@del.rey";
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");
    const productName = "zara coat 3";
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count = await products.count();
    for(let i=0; i<count; i++)
    {
        if(await products.nth(i).locator("b").textContent() === productName)
        {
            await products.nth(i).locator("[class*='w-10']").click();
            break;
        }
    };
    await page.locator(".btn.btn-custom").locator("text=Cart").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").type("ind",{delay:1000});
    const options = page.locator(".ta-results");
    await options.waitFor();
    const opCount = await options.locator("button").count();
    for(let i =0; i<opCount; i++){
        const text = await options.locator("button").nth(i).textContent();
        if(text === " India"){
            await options.locator("button").nth(i).click();
            break;
        }

    };
    await expect(page.locator(".user__name label")).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    const table = page.locator("table");
    await table.waitFor();
    const tableCount = await table.locator("tbody th").count();
    for(let i=0; i<tableCount; i++){
        const id = await table.locator("tbody th").nth(i).textContent();
        if(orderId.includes(id)){
            await table.locator("button").nth((2*i)-2).click();
            break;
        }
    };
    await expect(page.locator(".email-title")).toHaveText(" order summary ");



    //await page.pause();
});



