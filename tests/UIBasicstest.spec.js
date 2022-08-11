const {test, expect} = require('@playwright/test');


// test("First PW test", async ({browser,page})=>
// {
//     // const context = await browser.newContext();
//     // const page = await context.newPage();
//     await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
// });

test("Browser Context PW test", async ({browser})=>
{
    
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await userName.type("rahulshetty");
    await page.locator('[type="password"]').type('learning');
    await signIn.click();
    // console.log(await page.locator("[style*='block']").textContent())
    // console.log(tekst)
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await Promise.all(
        [
            signIn.click(),
            page.waitForNavigation(),        
        ]
    )
    
    // console.log(await cardTitles.first().textContent());
    // console.log(await cardTitles.nth(1).textContent());
    console.log(await cardTitles.allTextContents());

});

test.only("UIControls", async ({page})=>
{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const dropdown = page.locator("select.form-control");
    const userRadio = page.locator(".radiotextsty").last();
    const terms = page.locator("#terms");
    const documentLink = page.locator("[href*='documents-request']");
    await dropdown.selectOption("consult");
    // await page.pause();
    await userRadio.click();
    await page.locator("#okayBtn").click();
    await expect(userRadio).toBeChecked(); //asertion if radiobutton is checked
    //await userRadio.isChecked(); //tu tylko boolean
    // await page.pause();
    await terms.click();
    await expect(terms).toBeChecked();
    await terms.uncheck();
    const checked = await terms.isChecked();
    expect(await checked).toBeFalsy();
    // await page.pause();
    await expect(documentLink).toHaveAttribute("class","blinkingText");

});

test("Child windows handle", async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentLink = page.locator("[href*='documents-request']");
    
    const [newPage] = await Promise.all(
        [
            context.waitForEvent("page"),
            documentLink.click(),
    ]);
    const text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await userName.type(domain);
    await page.pause();





});