import { test, expect, Page } from '@playwright/test';
import { ExcelService, IBook } from "../../excel";
import { getBooks } from "./bookList.spec";

test.describe('bookDetail', async () => {
  test('get book details', async ({ page }) => {
    let bookDetailsList = [];
    const bookList = new ExcelService().readJsonFromExcelFile('编程图书数据-1652260737036.xlsx');
    for (let i = 0; i < bookList.length; i++) {
      const bookDetailUrl = bookList[i].bookUrl;
      await page.goto(bookDetailUrl);
      let bookDetails = await getBookDetails(page);
      bookDetailsList.push(bookDetails);
    }
    new ExcelService().exportAsExcelFile(bookDetailsList, `编程图书数据`);
  });

});

export async function getBookDetails(page: Page) {
  let bookDetails = {};
  let objectList = {};
  const bookName = await page.locator('//*[@id="wrapper"]/h1/span').innerText();
  const bookImg = await page.locator('//*[@id="mainpic"]/a/img').getAttribute('src');
  const bookDetailList = (await page.locator('//*[@id="info"]').allInnerTexts())[0].split('\n');
  bookDetailList.forEach(item => {
    item = item.replace(/\s/g, '');
    if (item.includes(':')) {
      const key = item.split(':')[0];
      const value = item.split(':')[1];
      objectList[key] = value
    }
  })
  if (await page.locator('#link-report > .short > .intro > p > .a_show_full').count() > 0) {
    await page.locator('#link-report > .short > .intro > p > .a_show_full').click();
  }
  const intro = (await page.locator('#link-report').allInnerTexts());
  objectList['简介'] = intro.join('\n');
  bookDetails = { ...objectList };
  bookDetails['书名'] = bookName;
  bookDetails['图片'] = bookImg;

  return bookDetails;
}
