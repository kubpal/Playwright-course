const {test, expect, response, request} = require('@playwright/test');
const loginPayload = {userEmail: "lana@del.rey", userPassword: "Testy1!2@"};
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
let orderId;

// test("First PW test", async ({browser,page})=>
// {
//     // const context = await browser.newContext();
//     // const page = await context.newPage();
//     await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
// });
let token;
test.beforeAll( async () =>
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
    {
        data:loginPayload
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

    //order
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
       data: orderPayload,
       headers:{
            'Authorization': token,
            'Content-Type': 'application/json'
       },  
    })
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    orderId = orderResponseJson.orders[0];
    });

test.only("Browser Context PW test", async ({page})=>
{
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, token);
    
    await page.goto("https://rahulshettyacademy.com/client");
   
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    const table = await page.locator("table");
    await table.waitFor();
    const tableCount = await table.locator("tbody th").count();
    // console.log(orderId);
    // await page.pause();
    for(let i=0; i<tableCount; i++){
        const id = await table.locator("tbody th").nth(i).textContent();
        if(orderId.includes(id)){
            await table.locator("button").nth(2*i).click();
            break;
        }
    };
    await page.pause();
    await expect(page.locator(".email-title")).toHaveText(" order summary ");



    //await page.pause();
});

