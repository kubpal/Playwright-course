const {test, expect, request} = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const loginPayload = {userEmail: "lana@del.reynolds", userPassword: "Testy1!2@"};
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
const fakePayLoad = {data:[], message:"No Orders"};

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
    await page.pause();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=63188ed7c4d0c51f4f195df2", 
    route=> route.continue({url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6308d892c4d0c51f4f10a2d1'})
    )

    await page.locator("button:has-text('View')").first().click();
    await page.pause();
});

