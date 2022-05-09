// exportToExcel.ts
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
export class ExcelService {
    constructor() { }
    static toExportFileName(excelFileName: string): string {
        return `${excelFileName}-${new Date().getTime()}.xlsx`;
    }
    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, ExcelService.toExportFileName(excelFileName));
    }
    public readJsonFromExcelFile(fileUrl: string): IBook[] {
        const workbook = XLSX.readFile(fileUrl);
        return XLSX.utils.sheet_to_json(workbook.Sheets['data']);
    }
}
export interface IBook {
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
