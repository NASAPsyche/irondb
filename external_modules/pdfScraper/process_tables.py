"""
process_tables.py: The purpose of this file is to house functionality that will enable the processing of text gathered
from tables in a pdf. This script will call the pdf_table_input.py script to get the text and return a json of the processed
text.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import PyPDF2
from tabula import convert_into
import os

# created a pdf file object
pdfFileObj = open('pdfs/WassonandChoe_GCA_2009.pdf', 'rb')

# created a pdf reader object
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

# This is the number of pages contained in the current pdf
numPagesPDF = pdfReader.numPages

# The string name of the current pdf. This includes the path
pdfStringName = pdfFileObj.name

# An array that holds the names of all of the documents inside the PDF folder
fileNames = []


# START This function displays the names of the PDS in the folder called "pdfs".
def display_pdf_names():
    path = "pdfs/"
    dirs = os.listdir(path)

    # This would print all the files and directories inside "pdfs"
    num = 1
    for file in dirs:
        if "pdf" in file:
            print(str(num) + ". " + file)
            fileNames.append(file)
            num += 1

    print("Please choose the file you would like to import. \n")
    fileChoice = input()
    currentWorkingFile = fileNames[int(fileChoice) - 1]
    print("\n You selected: " + fileChoice + ". " + currentWorkingFile)
# END This function displays the names of the PDS in the folder called "pdfs".


# START This function processes a table import from a chosen pdf request.
def process_tables():
    print(pdfStringName + " is the name of the imported pdf.")
    print("You have chosen to import tables.")
    convert_into(pdfStringName, "text.csv", output_format="csv", pages=str(select_page()))
    return
# END This function processes a table import request.


# START This function processes a raw text import from a chosen pdf request.
def process_text():
    print("You have chosen to import text from your pdf:")

    # # created a pdf file object
    # pdfFileObj = open('pdfs/Choietal_GCA_1995.pdf', 'rb')
    #
    # # created a pdf reader object
    # pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

    # printing number of pages in pdf file
    print(str(pdfReader.numPages) + " pages in file.")

    pageCount = pdfReader.numPages
    individualPage = []

    x = 0
    while x < pageCount:
        pageObj = pdfReader.getPage(x)
        individualPage.append(pageObj.extractText())
        x += 1
    # # creating a page object
    # pageObj = pdfReader.getPage(1)

    # extracting text from page
    # print(pageObj.extractText())

    # closing the pdf file object
    pdfFileObj.close()

    print(individualPage[2])

    return
# END This function processes a raw text import from a chosen pdf request.

# START This function allows the user to select a page that they want to get a table from.
def select_page():
    print("Please select the page you want to extract the table from:")
    page_to_get = input()
    return page_to_get
# END This function allows the user to select a page that they want to get a table from.


# START This function validates that input is an integer within a specific range.
def input_number(message, hiNum, loNum):
    while True:
        try:
            userInput = int(input(message))
        except ValueError:
            print("Not an integer! Try again.")
            continue
        else:
            return userInput
# START This function validates that input is an integer within a specific range.



