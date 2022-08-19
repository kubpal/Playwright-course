const {test, expect, request} = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const loginPayload = {userEmail: "lana@del.rey", userPassword: "Testy1!2@"};
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};

let response;
test.beforeAll( async () =>
{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
    //order

});

test.only("place order by API", async ({page})=>
{
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, response.token);
    
    await page.goto("https://rahulshettyacademy.com/client");
   
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    const table = await page.locator("table");
    await table.waitFor();
    const tableCount = await table.locator("tbody th").count();
    // console.log(orderId);
    // await page.pause();
    for(let i=0; i<tableCount; i++){
        const id = await table.locator("tbody th").nth(i).textContent();
        if(response.orderId.includes(id)){
            await table.locator("button").nth(2*i).click();
            break;
        }
    };
    await page.pause();
    await expect(page.locator(".email-title")).toHaveText(" order summary ");



    //await page.pause();
});

