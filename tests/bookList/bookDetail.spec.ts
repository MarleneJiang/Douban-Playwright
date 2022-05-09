import { test, expect, Page } from '@playwright/test';
import { ExcelService } from "../../excel";
import { getBooks } from "./bookList.spec";

test.describe('bookDetail', async () => {
  test('get book details', async ({ page }) => {
    for (let i = 0; i < (await getBooks(page)).length - 1; i++) {
      await page.goto((await getBooks(page))[i].bookUrl);
      const showAll = page.locator('//*[@id="link-report"]/span[1]/div/p[4]/a');
      showAll.click();
      const bookDetail = page.locator('//*[@id="link-report"]/span[1]/div/p').innerText;
      console.log(bookDetail);
    }
  });

});