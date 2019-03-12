import PyPDF2
import sys
import os
import json
from tabula import read_pdf
import pandas as pd
pd.options.display.max_rows = 999
pd.options.display.max_columns = 999

# sys.argv[0]  = path of python script that is running
# sys.argv[1]  = Name of file
# sys.argv[2]  = Page number
# sys.argv[3] = Number of task to call.
# sys.argv[4]  = Direction to flip page
# To test use python table_driver_single.py Wasson_2010.pdf 5 0 90


print(sys.argv[1])

pdf_name = "pdfs/" + str(sys.argv[1])
tables_rec_from_pages = []


def target_coords():
    print(sys.argv[1])
    pdfname = "pdfs/Wassonetal_GCA_2007.pdf"
    page_num = int(sys.argv[2])

    # page_in = open(pdfname, 'rb')
    return read_pdf(pdfname, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=page_num, silent=True, area=[521.71, 27.73, 705, 560])


def rotate_page():
    pagenum = int(sys.argv[2])
    page_in = open(pdf_name, 'rb')
    page_reader = PyPDF2.PdfFileReader(page_in)

    page = page_reader.getPage(pagenum)
    page.rotateClockwise(90)
    return read_pdf(pdf_name, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=pagenum, silent=True)


if int(sys.argv[3]) == 0:
    tables_rec_from_pages = rotate_page()

elif int(sys.argv[3]) == 1:
    tables_rec_from_pages = target_coords()

for ind in range(len(tables_rec_from_pages)):
    tables_rec_from_pages[ind] = json.loads(tables_rec_from_pages[ind].to_json())


print(tables_rec_from_pages)
