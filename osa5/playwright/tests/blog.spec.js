const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    const createAccountRes = await request.post('http://localhost:3003/api/user', {
      data: {
        name: 'taneli',
        username: 'taneli',
        password: 'salainen'
      }
    })

    console.log('create acconunt res', createAccountRes.status())

    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())


  })

  test('Login form is shown', async ({ page }) => {

    const newBlogFormDiv = page.locator('.loginForm')
    await expect(newBlogFormDiv).toBeVisible()

  })

  test('login is success', async ({ page }) => {
    await page.getByLabel('username').fill('taneli')
    await page.getByLabel('password').fill('salainen')

    const loginResponse = page.waitForResponse(
    response => response.url().includes('/api/login') && response.status() === 200
    )

     const loginButton = page.locator('.loginButton')
    await loginButton.click()

    await loginResponse;  

    await expect(page.getByText('taneli logged in')).toBeVisible()
    })


    test('login fails with wrong password', async ({ page }) => {
        await page.getByLabel('username').fill('taneli')
        await page.getByLabel('password').fill('wrong')
        const loginButton = page.locator('.loginButton')
        await loginButton.click()
        await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
        
        await page.getByLabel('username').fill('taneli')
        await page.getByLabel('password').fill('salainen')
        const loginButton = page.locator('.loginButton')
        await loginButton.click()
        const showBlogsButton = page.locator('.showBlogsButton')
        await showBlogsButton.click()

        await page.locator('input[id="title"]').fill('uusi blogi')
        await page.locator('input[id="author"]').fill('taneli')
        await page.locator('input[id="url"]').fill('http://f.com')

        // const postRes = page.waitForResponse(response => 
        // response.url().includes('/api/blogs') && response.status() === 201
        // );
    
        const createButton = page.locator('.createBlogButton')
        await createButton.click()

        // await postRes;

        await page.waitForTimeout(1000)

        await page.screenshot({ path: 'blog_created.png' })

        console.log(await page.content())

       await expect(page.getByText('uusi blogi by taneli')).toBeVisible({timeout: 10000});
    })

    test('like blog', async ({ page }) => {
        await page.getByLabel('username').fill('taneli')
        await page.getByLabel('password').fill('salainen')
        const loginButton = page.locator('.loginButton')

        const loginResponse = page.waitForResponse(
        response => response.url().includes('/api/login') && response.status() === 200
        )

        await loginButton.click()

        await loginResponse;

        const showBlogsButton = page.locator('.showBlogsButton')
        await showBlogsButton.click()
        await page.locator('input[id="title"]').fill('uusi blogi')
        await page.locator('input[id="author"]').fill('taneli')
        await page.locator('input[id="url"]').fill('http://f.com')
        const createButton = page.locator('.createBlogButton')
        await createButton.click()
        const viewButton = page.locator('.showAllButton')
        await viewButton.click()
        const likeButton = page.getByText('like')
        await likeButton.click()
        await page.waitForTimeout(1000)
        await expect(page.getByText('likes 1')).toBeVisible();
    })


})