import xlrd
import unittest

class ExcelFile:
    directory = "data/"
    head_line_quantity = 2
    starting_sheet = 0

    def __init__(self, filename):
        """Open excel file to read it"""
        self.book = xlrd.open_workbook(self.directory + filename)
        self.spreadsheet = self.book.sheet_by_index(self.starting_sheet)

    def read_row_spreadsheet(self):
        bordereaux = []
        for i in range(self.head_line_quantity, self.spreadsheet.nrows):
            bordereaux.append(self.spreadsheet.row_values(i))
        return(bordereaux)



excel_file = ExcelFile("test.xlsx");
print(excel_file.read_row_spreadsheet())
