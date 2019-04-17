"""
pdf_text_import.py: The purpose of this file is to develop the entire journal scraper functionality with the touch of a button. This
is simply meant to help devlop python parts of the web application. This is not shipable code.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "03/7/18"
"""

import PyPDF2
import json

import sys


try:
    j = json.loads(sys.argv[1])
    fileName = j['fileName']
    fileName = '/usr/app/public/temp/' + fileName

    # START Get number of Pages
    total_pages = PyPDF2.PdfFileReader(open(fileName, 'rb')).numPages
except Exception:
    print("-1")

else:
    print(total_pages)
