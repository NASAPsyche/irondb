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
import json


# {'/CreationDate': "D:20090708173046+05'30'", '/Author': '"John T. Wasson; Won-Hie Choe"', '/Creator': 'Elsevier',
#  '/Producer': 'Acrobat Distiller 8.0.0 (Windows)', '/AuthoritativeDomain#5B1#5D': 'sciencedirect.com',
# '/AuthoritativeDomain#5B2#5D': 'elsevier.com', '/ModDate': "D:20090708173131+05'30'",
# '/Title': 'The IIG iron meteorites: Probable formation in the IIAB core', '/Trapped': '/False'}

def get_metadata(path):
    with open(path, 'rb') as f:
        pdf = PyPDF2.PdfFileReader(f, strict=False)
        info = pdf.getDocumentInfo()
        meta_to_json(info)


# START This function imports raw text import from a chosen pdf request.



def get_num_pages(path):
    # created a pdf file object
    pdfFileObj = open(path, 'rb')

    # created a pdf reader object
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

    # This is the number of pages contained in the current pdf
    numPagesPDF = pdfReader.numPages
    return numPagesPDF



def meta_to_json(info):
    author = "EMPTY"
    if (info.author):
        author = info.author

    title = "EMPTY"
    if (info.title):
        title = info.title
    x = {
        "author": author,
        "title": title,
    }

    y = json.dumps(x)

    print(y)
    return info
