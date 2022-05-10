import { test, expect, Page } from '@playwright/test';
import { ExcelService, IBook } from "../../excel";
import { getBooks } from "./bookList.spec";

test.describe('bookDetail', async () => {
  test('get book details', async ({ page }) => {
    const bookList = new ExcelService().readJsonFromExcelFile('互联网图书数据-1652080712920.xlsx');
    for (let i = 0; i < bookList.length; i++) {
      const bookDetailUrl = bookList[i].bookUrl;
      await page.goto(bookDetailUrl);
      let a = await getBookDetails(page);
      console.log(a);
    }
  });

});


export async function getBookDetails(page: Page) {
  let bookDetails = [];
  let objectList = {};
  const bookName = await page.locator('//*[@id="wrapper"]/h1/span').innerText();
  const bookImg = await page.locator('//*[@id="mainpic"]/a/img').getAttribute('src');
  const bookDetailList = (await page.locator('//*[@id="info"]').allInnerTexts())[0].split('\n');
  bookDetailList.forEach(item=>{
    item = item.replace(/\s/g, '');
    if (item.includes(':')) {
      const key = item.split(':')[0];
      const value = item.split(':')[1];
      objectList[key] = value
    }
  })
  bookDetails.push({
    bookName,
    bookImg,
    objectList
  })
  return bookDetails;
}
