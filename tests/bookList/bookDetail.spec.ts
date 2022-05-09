import { test, expect, Page } from '@playwright/test';
import { ExcelService, IBook } from "../../excel";
import { getBooks } from "./bookList.spec";

test.describe('bookDetail', async () => {
  test('get book details', async ({ page }) => {
    const bookList = new ExcelService().readJsonFromExcelFile('互联网图书数据-1652080712920.xlsx');
    console.log(bookList);
  });

});