const {test, expect, request} = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const loginPayload = {userEmail: "lana@del.rey", userPassword: "Testy1!2@"};
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
    
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/62b7f98ee26b7e1a10eedbae",
    async route=>
    {
        const response = await page.request.fetch(route.request())
        let body = fakePayLoad;
        route.fulfill(
            {
                response,
                body
            }
        )
    }
    )
    await page.pause();
    await page.locator("button[routerlink='/dashboard/myorders']").click();

});

