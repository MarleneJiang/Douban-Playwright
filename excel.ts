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
}