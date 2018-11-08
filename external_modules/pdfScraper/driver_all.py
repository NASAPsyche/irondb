"""
driver_all.py: The purpose of this file is to drive the entire journal scraper functionality with the touch of a button.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import process_tables
import process_text
from PyPDF2 import PdfFileReader
# process_text.convert_pdf_to_txt("pdfs/WassonandChoe_GCA_2009.pdf")


def get_info(path):
    with open(path, 'rb') as f:
        pdf = PdfFileReader(f)
        info = pdf.getDocumentInfo()
        author = info.author
        print(author)



path = "pdfs/WassonandChoe_GCA_2009.pdf"

get_info(path)




# process_tables.display_pdf_names()

choice = 0
while int(choice) < 3:
    print(" _________________________________________")
    print("| Main Choice: Choose 1 of 5 choices:    |")
    print("| Choose 1 to import text data from pdf. |")
    print("| Choose 2 to import table data from pdf.|")
    print("| Choose any other number to quit.       |")
    print(" -----------------------------------------")

    choice = input()

    if int(choice) == 1:
        print("Text dump")
       # process.process_text()
    elif int(choice) == 2:
        process_tables.process_tables()
    elif int(choice) == 3:
        break
