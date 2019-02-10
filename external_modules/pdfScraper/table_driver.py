"""
table_driver.py: The purpose of this file is to develop the entire journal scraper functionality with the touch of a button. This
is simply meant to help devlop python parts of the web application. This is not shipable code.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import PyPDF2
from tabula import read_pdf
import pandas as pd
import re
pd.options.display.max_rows = 999
pd.options.display.max_columns = 999

import io
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage


master_json = ""
pages_with_tables = []
master_dict_tables = {}
pdf = ["pdfs/WassonandRichardson_GCA_2011.pdf",
       "pdfs/WassonandChoe_GCA_2009.pdf",
       "pdfs/Wasson_GCA_2017.pdf",
       "pdfs/WassonandChoi_2003.pdf",
       "pdfs/Litasov2018_Article_TraceElementCompositionAndClas.pdf",
       "pdfs/Wasson_2010.pdf",
       "pdfs/Wasson_2004.pdf",
       "pdfs/Wassonetal_GCA_2007.pdf",
       "pdfs/Ruzicka2014.pdf",
       "pdfs/WassonandKallemeyn_GCA_2002.pdf",
       "pdfs/RuzickaandHutson2010.pdf",
       "pdfs/spinTest.pdf"]

chosen_pdf = pdf[11]


# START 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT
# START 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT


# START This function imports raw text import from a chosen pdf request.
def convert_pdf_to_txt(path, pageNo=0):
    text = ""
    rsrcmgr = PDFResourceManager()
    retstr = io.StringIO()
    device = TextConverter(rsrcmgr, retstr, codec='utf-8', laparams=LAParams())
    fp = open(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)

    for page in PDFPage.get_pages(fp, pagenos=[pageNo], check_extractable=True):
        pageNo += 1
        interpreter.process_page(page)
        text = retstr.getvalue()
    fp.close()
    device.close()
    retstr.close()
    return text
# END This function imports raw text import from a chosen pdf request.

# START This function puts each page of text in its own slot in an array of strings
def convert_pdf_to_txt_looper(path, total_pages):
    individual_pages = []
    for check in range(total_pages):
        individual_pages.append(convert_pdf_to_txt(path, check))
    return individual_pages
# END This function puts each page of text in its own slot in an array of strings

# END 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT
# END 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT 0. GETTING THE TEXT
#
#

# START 4. REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS
# START 4. REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS

def process_tables_clean(mdf):
    row_count, col_count = mdf.shape
    col_iter = col_count - 1
    while col_iter >= 0:
        tally_col = row_iter = 0
        while row_iter < row_count:
            value_to_test = str(mdf.iloc[row_iter][col_iter])
            if value_to_test == "REMOVE":
                tally_col += 1
            row_iter += 1
        if tally_col / row_count > .49:
            if mdf.empty:
                print('DataFrame is empty!')
            else:
                # print(mdf)
                mdf = mdf.drop(mdf.columns[col_iter], axis=1)
        col_iter -= 1
    return mdf


def column_by_column(mdf):
    for col in reversed(range(df.shape[1])):
        for row in range(df.shape[0]):
            print(str(mdf.iloc[row][col]))


def row_by_row(mdf):
    for row in reversed(range(df.shape[0])):
        for col in range(df.shape[1]):
            print(str(mdf.iloc[row][col]))


# END 4. REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS
# END 4. REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS REMOVING BAD ROWS and COLS

# START Get number of Pages
total_pages = PyPDF2.PdfFileReader(open(chosen_pdf, 'rb')).numPages
# START Get number of Pages
print("There are " + str(total_pages) + " pages in this document.")

# START get text from pdf
text = convert_pdf_to_txt_looper(chosen_pdf, total_pages)
# End get text from pdf.

# START Getting pages that have tables on them.
for iterate in range(total_pages):
    splitted = text[iterate].split()
    if text[iterate].find('\nTable ') > 0 or splitted[0] == "Table" or bool(re.search(r'\w\n\w\n\w\n?', text[iterate])):
        print("############# Table exists on Page " + str(iterate + 1) + " #############" + "\n Word: "
              + str(text[iterate].find('\nTable ')))
        pages_with_tables.append(iterate + 1)
# END Getting pages that have tables on them.

# START Get tables 1 page at a time.
tables_rec_from_page = read_pdf(chosen_pdf, output_format="dataframe", encoding="utf-8",  multiple_tables=True,
                                pages=pages_with_tables, silent=True)

print(len(tables_rec_from_page))

# END Get tables 1 page at a time.

# Start Marking the fields for removal
if len(tables_rec_from_page) > 0:
    for df in tables_rec_from_page:
        for x in range(df.shape[0]):
            for y in range(df.shape[1]):
                if len(str(df[y][x])) > 20:
                    df[y][x] = "REMOVE"
print("START THE MARKING START THE MARKING START THE MARKING START THE MARKING START THE MARKING START THE MARKING ")
# print(tables_rec_from_page)
# End Marking the fields for removal

print("column_by_column************************************************************************************************************")
column_by_column(tables_rec_from_page[0])

print("row_by_row************************************************************************************************************")
row_by_row(tables_rec_from_page[0])

# table_cleaned = process_tables_clean(table_marked)
# # print(table_cleaned)
# return json.loads((table_cleaned.to_json(double_precision=10, force_ascii=True,date_unit='ms', lines=False)))


