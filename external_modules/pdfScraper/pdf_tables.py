"""
pdf_tables.py: The purpose of this file is to house functionality that will enable the processing of text gathered
from tables in a pdf. It will also enable the end user to pull a table out of a pdf and return it in a json string organized
by page.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

from tabula import read_pdf


# START This function processes a table import from a chosen pdf request.
def process_tables(path, page):
    print(path + " is the name of the imported pdf.")
    temp = read_pdf(path, output_format="dataframe", encoding="utf-8", java_options=None, pandas_options=None,
                    multiple_tables=True, pages=int(page), silent=True)
    print(temp)
    return
# END This function processes a table import request.


# START This function allows the user to select a page that they want to get a table from.
def select_page():
    print("Please select the page you want to extract the table from:")
    page_to_get = input()
    return page_to_get
# END This function allows the user to select a page that they want to get a table from.



