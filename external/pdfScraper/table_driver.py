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
import json
import io
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage


master_json = ""
pages_with_tables = []
text_pages_with_tables = []
pages_with_continue = []
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

chosen_pdf = pdf[0]

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





def row_by_row(mdf):
    i,j = mdf.shape
    for row in reversed(range(mdf.shape[0])):
        row_remove = 0
        row_null = 0
        for col in range(mdf.shape[1]):
            if str(mdf.iloc[row][col]) == "REMOVE":
                row_remove += 1
            if str(mdf.iloc[row][col]) == "nan":
                row_null += 1

        if mdf.shape[1] - (row_remove + row_null) < 2:
            mdf = mdf.drop(row)
            if mdf.empty:
                emptyDF = pd.DataFrame()
                return emptyDF
    return mdf

def column_by_column(mdf):
    for col in reversed(range(mdf.shape[1])):
        col_remove = 0
        col_null = 0
        for row in range(mdf.shape[0]):
            if str(mdf.iloc[row][col]) == "REMOVE":
                col_remove += 1
            if str(mdf.iloc[row][col]) == "nan":
                col_null += 1
        if mdf.shape[0] - (col_remove + col_null) < 2 or(col_remove + col_null)/ mdf.shape[0] > .85:
            mdf = mdf.drop(mdf.columns[col], axis=1)
            if mdf.empty:
                emptyDF = pd.DataFrame()
                return emptyDF
    return mdf


# START Get number of Pages
total_pages = PyPDF2.PdfFileReader(open(chosen_pdf, 'rb')).numPages
# START Get number of Pages

# START get text from pdf
text = convert_pdf_to_txt_looper(chosen_pdf, total_pages)
# End get text from pdf.

# Reading text on each page to find page number.
list_of_text_pages = []
for page in range(total_pages):
    test = re.findall(r'^\d+', text[page], re.IGNORECASE)
    if len(test) == 0:
        list_of_text_pages.append(int(0))
    else:
        list_of_text_pages.append(int(test[0]))
print(list_of_text_pages)

# Filling in the pages that are 0s
for text_page in range(len(list_of_text_pages)):
    if list_of_text_pages[text_page] == 0:
        if list_of_text_pages[text_page + 1]:
            list_of_text_pages[text_page] = list_of_text_pages[text_page + 1] - 1

print(list_of_text_pages)

# START Getting pages that have tables on them. looking for page 15
for iterate in range(total_pages):
    splitted = text[iterate].split()
    if splitted[0] == "Table" or text[iterate].find('\nTable ') > 0 or bool(re.search(r'\w\n\w\n\w\n', text[iterate])):
        pages_with_tables.append(iterate + 1)
        text_pages_with_tables.append(list_of_text_pages[iterate + 1])

print(text_pages_with_tables)
if pages_with_tables:
    for page in pages_with_tables:
        print(page)
        if re.search(r'Continued\S\n', text[page - 1], re.IGNORECASE):
            pages_with_continue.append(page)
# END Getting pages that have tables on them.

# START Get tables 1 page at a time.
tables_rec_from_pages = []
pages_confirmed_with_tables = []
text_pages_confirmed_with_tables = []
for page in range(len(pages_with_tables)):
    one_page_of_tables = read_pdf(chosen_pdf, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                  pages=pages_with_tables[page], silent=True)

    if one_page_of_tables:
        for table in one_page_of_tables:
            tables_rec_from_pages.append(table)
            pages_confirmed_with_tables.append(pages_with_tables[page])
            text_pages_confirmed_with_tables.append(text_pages_with_tables[page])
            # print(tables_rec_from_pages)
# END Get tables 1 page at a time.

# Start Marking the fields for removal
if len(tables_rec_from_pages) > 0:
    for df in tables_rec_from_pages:
        for x in range(df.shape[0]):
            for y in range(df.shape[1]):
                if len(str(df[y][x])) > 20:
                    # and not any(x.isupper() for x in str(df[y][x]))
                    df[y][x] = "REMOVE"
# End Marking the fields for removal

for ind in range(len(tables_rec_from_pages)):
    tables_rec_from_pages[ind] = row_by_row(tables_rec_from_pages[ind])


for remover in reversed(range(len(tables_rec_from_pages))):
    print(len(tables_rec_from_pages))
    # print("Testing page remover: " + str(pages_with_tables[remover]) + " index: " + str(remover))
    if tables_rec_from_pages[remover].empty:
        del tables_rec_from_pages[remover]
        del pages_confirmed_with_tables[remover]
        del text_pages_confirmed_with_tables[remover]

for ind in range(len(tables_rec_from_pages)):
    tables_rec_from_pages[ind] = column_by_column(tables_rec_from_pages[ind])

# Remove dead tables from list after col by col
for remover in reversed(range(len(tables_rec_from_pages))):
    print(len(tables_rec_from_pages))
    if tables_rec_from_pages[remover].empty:
        del tables_rec_from_pages[remover]
        del pages_confirmed_with_tables[remover]
        del text_pages_confirmed_with_tables[remover]

for ind in range(len(tables_rec_from_pages)):
    tables_rec_from_pages[ind] = '{\"actual_page\":' + str(text_pages_confirmed_with_tables[ind]) + ',\"pdf_page\": ' + str(pages_confirmed_with_tables[ind]) + ', \"Table\":' + tables_rec_from_pages[ind].to_json() + '}'
    # print(tables_rec_from_pages[ind])
print(tables_rec_from_pages)
