import { test, expect, Page } from '@playwright/test';
import { ExcelService } from "../../excel";


test.describe('bookList', async () => {
    let books = [];
    test('get book information', async ({ page }) => {
        const tagName = '科普'
        await page.goto(`https://book.douban.com/tag/${tagName}?start=800&type=T`);
        page.once('load', () => console.log('Page loaded!'));

        let nextButton = page.locator('text=后页>');
        
        while(await nextButton.getAttribute('href') !== null) {
            books = books.concat(await getBooks(page));
            await nextButton.click();
            if(await page.locator('text=后页>').count()<=0){
                break;
            }
            nextButton = page.locator('text=后页>');
        }
        books = books.concat(await getBooks(page));
        new ExcelService().exportAsExcelFile(books, `${tagName}图书数据`);
    });
    
});

export async function getBooks(page: Page): Promise<IBook[]> {
    let books =[];
    const bookLists = page.locator('//*[@id="subject_list"]/ul/li');
    const count = await bookLists.count();
    console.log(`count: ${count}`);
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
        // console.log(bookName);
        books.push(book);
    }
    return books;
}

interface IBook {
    bookId: string;
    bookName: string;
    bookUrl: string;
    bookImg: string;
    bookAuthor: string;
    bookPubPlace: string;
    bookPubDate: string;
    bookRating: string;
    bookRatingPeople: string;
    bookIntro: string;
}