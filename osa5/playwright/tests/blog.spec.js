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
  })

  test('Login form is shown', async ({ page }) => {

    const newBlogFormDiv = page.locator('.loginForm')
    await expect(newBlogFormDiv).toBeVisible()

  })

  test('login is success', async ({ page }) => {
    await page.getByLabel('username').fill('taneli')
    await page.getByLabel('password').fill('salainen')
    const loginButton = page.locator('.loginButton')
    await loginButton.click()
    await page.screenshot({ path: 'afterlogin.png' })

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
    
        const createButton = page.locator('.createBlogButton')
        await createButton.click()

        await page.waitForTimeout(1000)

        await page.screenshot({ path: 'blog_created.png' })

        console.log(await page.content())

        await expect(page.getByText("uusi blogi by taneli")).toBeVisible()

    })

})