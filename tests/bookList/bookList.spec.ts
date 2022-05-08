import { test, expect } from '@playwright/test';
test.describe('bookList', async () => {
    
    test('get book information', async ({ page }) => {
        await page.goto('https://book.douban.com/tag/%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C');
        page.once('load', () => console.log('Page loaded!'));
        let bookList = await page.locator('//*[@id="subject_list"]/ul/li/div[2]/h2/a').allInnerTexts();
        for (let i = 0; i < bookList.length; i++) {
            const id = await page.locator('//*[@id="subject_list"]/ul/li['+(i+1).toString()+']/div[2]/h2/a').getAttribute('onclick');
            console.log(id);
        }

        await page.screenshot({ path: 'bookList.png' });
        


    });
    
});
