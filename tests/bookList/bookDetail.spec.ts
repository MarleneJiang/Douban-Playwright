import { test, expect, Page } from "@playwright/test";
import { ExcelService } from "../../utils/excel";
import type { IBook } from "../../utils/type";
import { getBooks } from "./bookList.spec";

test.describe("bookDetail", async () => {
  test("get book details", async ({ page }) => {
    let bookDetailsList: Array<Record<string, string>> = [];
    const bookList = new ExcelService().readJsonFromExcelFile(
      "通信图书数据-1652535990284.xlsx"
    );
    for (let i = 0; i < bookList.length; i++) {
      const bookDetailUrl = bookList[i].bookUrl;
      await page.goto(bookDetailUrl);
      let bookDetails = await getBookDetails(page);
      bookDetailsList.push(bookDetails);
    }
    new ExcelService().exportAsExcelFile(bookDetailsList, `通信图书数据`);
  });
});

export async function getBookDetails(
  page: Page
): Promise<Record<string, string>> {
  let bookDetails = {};
  let infoList: Record<string, string> = {};
  const bookName = await page.locator('//*[@id="wrapper"]/h1/span').innerText();
  const bookImg = await page
    .locator('//*[@id="mainpic"]/a/img')
    .getAttribute("src");
  const bookDetailList = (
    await page.locator('//*[@id="info"]').allInnerTexts()
  )[0].split("\n");
  bookDetailList.forEach((item) => {
    item = item.replace(/\s/g, "");
    if (item.includes(":")) {
      const key = item.split(":")[0];
      const value = item.split(":")[1];
      infoList[key] = value;
    }
  });
  const btnShowMore = page.locator(
    "#link-report > .short > .intro > p > .a_show_full"
  );
  if ((await btnShowMore.count()) > 0) {
    btnShowMore.click();
  }
  const intro = await page.locator("#link-report").allInnerTexts();
  infoList["简介"] = intro.join("\n");
  bookDetails = { ...infoList };
  bookDetails["书名"] = bookName;
  bookDetails["图片"] = bookImg;

  return bookDetails;
}
