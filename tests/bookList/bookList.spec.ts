import { test, expect, Page } from '@playwright/test';
import { ExcelService } from "../../excel";


test.describe('bookList', async () => {
    let books = [];
    test('get book information', async ({ page }) => {
        await page.goto('https://book.douban.com/tag/%E4%BA%92%E8%81%94%E7%BD%91?start=540&type=T');
        page.once('load', () => console.log('Page loaded!'));

        let nextButton = page.locator('text=后页>');
        while(await nextButton.getAttribute('href') !== null) {
            books = books.concat(await getBooks(page));
            await nextButton.click();
            await expect(page.locator('text=后页>')).toBeVisible();
            nextButton = page.locator('text=后页>');
        }

        new ExcelService().exportAsExcelFile(books, "互联网图书数据");
    });
    
});

async function getBooks(page: Page) {
    let books =[];
    const bookLists = page.locator('//*[@id="subject_list"]/ul/li');
    const count = await bookLists.count();
    for(let i = 0; i < count; i++) {
        const bookTitle = bookLists.nth(i).locator('div.info > h2 > a');
        const bookId = (await bookTitle.getAttribute('onclick')).split("'")[5];
        const bookName = await bookTitle.innerText();
        const bookUrl = `https://book.douban.com/subject/${bookId}/`;
        const bookImg = await bookLists.nth(i).locator('div.pic > a > img').getAttribute('src');
        const bookPub = await bookLists.nth(i).locator('div.info > div.pub').innerText();
        const bookAuthor = bookPub.split('/')[0];
        const bookPubPlace = bookPub.split('/')[1];
        const bookPubDate = bookPub.split('/')[2];

        // check if the rating_nums is exist
        let bookRating = 'null';
        let bookRatingPeople = 'null';
        if(await bookLists.nth(i).locator('div.info > div.star > span.rating_nums').count()>0){
            bookRating = await bookLists.nth(i).locator('div.info > div.star > span.rating_nums').innerText();
            bookRatingPeople = (await bookLists.nth(i).locator('div.info > div.star > span.pl').innerText()).replace(/[^\d]/g,'');
        }

        // check if the p element of dic.info is exist
        let bookIntro ='';
        if(await bookLists.nth(i).locator('div.info > p').count()>0) {
            bookIntro = await bookLists.nth(i).locator('div.info > p').innerText();
        }

        
        const book = {bookId, bookName, bookUrl, bookImg, bookAuthor, bookPubPlace, bookPubDate, bookRating, bookRatingPeople, bookIntro};
        console.log(bookName);
        books.push(book);
    }
    return books;
}