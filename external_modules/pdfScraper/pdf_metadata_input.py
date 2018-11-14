"""
pdf_metadata_input.py: The purpose of this file is to house functionality that will enable the end user to pull metadata
out of a pdf and return it in a json string.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import PyPDF2


def get_metadata(path):
    with open(path, 'rb') as f:
        pdf = PyPDF2.PdfFileReader(f, strict=False)
        info = pdf.getDocumentInfo()
        author = info.author
        print (info)
        return info


def get_num_pages(path):
    # created a pdf file object
    pdfFileObj = open(path)

    # created a pdf reader object
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

    # This is the number of pages contained in the current pdf
    numPagesPDF = pdfReader.numPages

    # The string name of the current pdf. This includes the path
    pdfStringName = pdfFileObj.name

def get_file_path_name(path):
    # created a pdf file object
    pdfFileObj = open(path)
    # created a pdf reader object
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
    # The string name of the current pdf. This includes the path
    pdfStringName = pdfFileObj.name
    return pdfStringName



# path2 = "pdfs/WassonandChoe_GCA_2009.pdf"

# print(get_info(path2))


# TODO: Decide what we want to use out of the metadata.

