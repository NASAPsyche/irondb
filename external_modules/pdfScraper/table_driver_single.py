import PyPDF2
import sys
import os
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
pagenum = int(sys.argv[2]) - 1


def target_coords():
    print(sys.argv[1])
    pdf_name = "pdfs/" + str(sys.argv[1])
    pdf_name = "pdfs/Wassonetal_GCA_2007.pdf"
    pagenum = int(sys.argv[2]) - 1
    pagenum = 5

    page_in = open(pdf_name, 'rb')
    page_reader = PyPDF2.PdfFileReader(page_in)
    page_in.close()
    tables_rec_from_page = read_pdf(pdf_name, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=pagenum, silent=True, area=[521.71, 27.73, 705, 560])
    print(tables_rec_from_page)


def turn_page():
    page_in = open(pdf_name, 'rb')
    page_reader = PyPDF2.PdfFileReader(page_in)
    page_writer = PyPDF2.PdfFileWriter()

    page = page_reader.getPage(pagenum)
    page.rotateClockwise(90)
    page_writer.addPage(page)

    pdf_out = open('rotatedPage.pdf', 'wb')
    page_writer.write(pdf_out)
    pdf_out.close()
    page_in.close()


if int(sys.argv[3]) == 0:
    turn_page()
    # START Get tables 1 page at a time.
    tables_rec_from_page = read_pdf('rotatedPage.pdf', output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=0, silent=True)
    os.remove("rotatedPage.pdf")
    print(tables_rec_from_page)

elif int(sys.argv[3]) == 1:
    target_coords()
