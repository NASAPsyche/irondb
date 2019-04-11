import PyPDF2
import sys
import os.path
import json
from tabula import read_pdf
import pdf_text_import as pti
import table_page_finder as tpf

j = json.loads(sys.argv[1])
fileName = j['fileName']
fileName = '/usr/app/public/temp/' + fileName
pageNum = int(j['pageNum'])
total_pages = [pageNum]
flipDir = int(j['flipDir'])
coordsLeft = int(j['coordsLeft'])
coordsTop = int(j['coordsTop'])
coordsWidth = int(j['coordsWidth'])
coordsHeight = int(j['coordsHeight'])
#
# print(fileName)
# pdfname = '/usr/app/external/pdfScraper/pdfs/WassonandChoe_GCA_2009.pdf'
tables = []


def target_coords():
    return read_pdf(fileName, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=pageNum, silent=True, area=[521.71, 27.73, 705, 560])


def rotate_page():
    page_in = open(fileName, 'rb')
    page_reader = PyPDF2.PdfFileReader(page_in)
    page = page_reader.getPage(pageNum)
    page.rotateClockwise(flipDir)
    return read_pdf(fileName, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=pageNum, silent=True)


if flipDir > 0:
    tables = rotate_page()


if coordsLeft > 0 or coordsHeight > 0 or coordsTop > 0 or coordsWidth > 0:
    tables = target_coords()
else:
    tables = read_pdf(fileName, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                  pages=pageNum, silent=True)
if len(tables) > 0:
    for ind in range(len(tables)):
        tables[ind] = '{\"actual_page\":' + str(0) \
                      + ',\"pdf_page\": ' + str(pageNum) \
                      + ', \"Table\":' + tables[ind].to_json() + '}'
        print(tables[ind])

else:
    print("-1000")

