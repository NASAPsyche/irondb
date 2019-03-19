import PyPDF2
import sys
import os
import json
from tabula import read_pdf
import pandas as pd


# cwd = os.getcwd()  # Get the current working directory (cwd)
# files = os.listdir(cwd)  # Get all the files in that directory
# print("Files in '%s': %s" % (cwd, files))

j = json.loads(sys.argv[1])
# fileName = j['fileName']
fileName = '/usr/app/controller/py/WassonandChoe_GCA_2009.pdf'
pageNum = int(j['pageNum'])
taskNum = int(j['taskNum'])
flipDir = int(j['flipDir'])
coordsLeft = j['coordsLeft']
coordsTop = j['coordsTop']
coordsWidth = j['coordsWidth']
coordsHeight = j['coordsHeight']
# print(pageNum)

tables_rec_from_pages = []

def target_coords():

    # page_in = open(fileName, 'rb')
    return read_pdf(fileName, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=page_num, silent=True, area=[521.71, 27.73, 705, 560])


def rotate_page():
    # page_in = open(fileName, 'rb')
    # page_reader = PyPDF2.PdfFileReader(page_in)
    #
    # page = page_reader.getPage(pageNum)
    # page.rotateClockwise(flipDir)
    return read_pdf(fileName, output_format="dataframe", encoding="utf-8", multiple_tables=True,
                                    pages=pageNum, silent=True)


if taskNum == 0:
    tables_rec_from_pages = rotate_page()

elif taskNum == 1:
    tables_rec_from_pages = target_coords()

for ind in range(len(tables_rec_from_pages)):
    tables_rec_from_pages[ind] = tables_rec_from_pages[ind].to_json()

print(tables_rec_from_pages)
