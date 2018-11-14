"""
pdf_metadata.py: The purpose of this file is to house functionality that will enable the end user to pull metadata
out of a pdf and return it in a json string. It will also enable the end user to pull text out of a pdf
 and return it in a json string organized by page.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import PyPDF2
import sys






def get_metadata(paper):
    with open("pdfs/WassonandChoe_GCA_2009.pdf", 'rb') as f:
        pdf = PyPDF2.PdfFileReader(f, strict=False)
        info = pdf.getDocumentInfo()
        author = info.author
        print("The paper we will get metdadata from is " + paper + " The metdadata is as follows: " + str(info))
        return info


# START This function imports raw text import from a chosen pdf request.

get_metadata(str(sys.argv[1]))

def get_num_pages(path):
    # created a pdf file object
    pdfFileObj = open(path, 'rb')

    # created a pdf reader object
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

    # This is the number of pages contained in the current pdf
    numPagesPDF = pdfReader.numPages
    return numPagesPDF


