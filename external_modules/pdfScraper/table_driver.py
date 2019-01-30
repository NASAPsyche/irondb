"""
table_driver.py: The purpose of this file is to develop the entire journal scraper functionality with the touch of a button. This
is simply meant to help devlop python parts of the web application. This is not shipable code.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""
import json
import os
import PyPDF2
from tabula import read_pdf
import pandas as pd
pd.options.display.max_rows = 999
pd.options.display.max_columns = 999

import io
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage


master_json = ""


# START THIS IS TEMP DEV TEST CODE///////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# START This function displays the names of the PDS in the folder called "pdfs".
def display_pdf_names(directory):
    num = 1
    fileChoice = 0
    while(int(fileChoice) < 1 or int(fileChoice) > num):
        num = 0
        fileNames = []
        path = directory
        dirs = os.listdir(path)

        # This prints all the files and directories inside "pdfs"
        for file in dirs:
            if "pdf" in file:
                print(str(num + 1) + ". " + file)
                fileNames.append(file)
                num += 1
        print("Please choose the file you would like to import. \n")
        fileChoice = input()
        if(int(fileChoice) < 1 or int(fileChoice) > num):
            print(str(fileChoice) + " Please choose a valid number. \n")

    currentWorkingFile = fileNames[int(fileChoice) - 1]
    return currentWorkingFile
# END This function displays the names of the PDS in the folder called "pdfs".


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
# END THIS IS TEMP DEV TEST CODE///////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


# START GETTING THE TABLES /////////////////////////////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# START This function imports raw text import from a chosen pdf request.
def convert_pdf_to_txt(path, pageNo=0):
    text = ""
    rsrcmgr = PDFResourceManager()
    retstr = io.StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    fp = open(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)

    for page in PDFPage.get_pages(fp, pagenos=[pageNo], check_extractable=True):
        pageNo += 1
        interpreter.process_page(page)
        text = retstr.getvalue()
    fp.close()
    device.close()
    retstr.close()
    return text
# END This function imports raw text import from a chosen pdf request.

# START This function puts each page of text in its own slot in an array of strings
def convert_pdf_to_txt_looper(path, num_pages):
    individual_pages = []
    check = 0

    while check <= num_pages - 1:
        individual_pages.append(convert_pdf_to_txt(path, check))
        check += 1
    return individual_pages
# END This function puts each page of text in its own slot in an array of strings

# END GETTING THE TABLES //////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


# START This function finds pages in a pdf that have tables on it and makes an array of these pages in order to iterarte through
# them later.
def look_for_tables(pages, num_pages):
    pages_with_tables = []
    iterate = 0
    while iterate <= num_pages - 1:
        # print("test " + str(iterate))
        splitted = pages[iterate].split()
        if pages[iterate].find('\nTable ') > 0 or splitted[0] == "Table":
            print("############# Table exists on Page " + str(iterate + 1) + " #############" + "\n Word: "
            + str(pages[iterate].find('\nTable ')))
            pages_with_tables.append(iterate + 1)
        iterate += 1
    return pages_with_tables
# END This function finds pages in a pdf that have tables on it and makes an array of these pages in order to iterarte through
# them later.

# START Getting total pages of pdf
def get_num_pages(path):
    # created a pdf file object
    pdfFileObj = open(path, 'rb')

    # created a pdf reader object
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

    # This is the number of pages contained in the current pdf
    numPagesPDF = pdfReader.numPages
    return numPagesPDF
# END Getting total pages of pdf


# START This is getting the current pdfs in the pdf folder.
chosen_pdf = display_pdf_names("pdfs/")
print("\n You selected: " + chosen_pdf)
# END This is getting the current pdfs in the pdf folder.

chosen_pdf = "pdfs/" + chosen_pdf


# START Get number of Pages
total_pages = get_num_pages(chosen_pdf)
# START Get number of Pages
# print("There are " + str(total_pages) + " pages in this document.")


# START get text from pdf
text = convert_pdf_to_txt_looper(chosen_pdf, total_pages)
# print("The following is the entire text from the chosen pdf. \n")
# print(text[0])
# End get text from pdf.

# START Getting pages that have tables on them.
pages_with_table = look_for_tables(text, total_pages)
# END Getting pages that have tables on them.

# START Get tables 1 page at a time.
more = len(pages_with_table)
pwt_count = 0
accepted_table = 1
table_json_to_send = {}
array_tables = []

# START PROCESSING THE TABLES//////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
##################################################################################################################################
# Function Name: process_tables_clean
# Function Purpose: This function gets rid of unwanted cols and rows.
# Function Inputs: a dataframe with information from.a table.
# Function Output:A clean dataframe
##################################################################################################################################
def process_tables_clean(mdf):
    row_count, col_count = mdf.shape
    # print(mdf.shape)
    # print(mdf)
    col_iter = col_count - 1
    while col_iter >= 0:
        tally_col = row_iter = 0
        while row_iter < row_count:
            value_to_test = str(mdf.iloc[row_iter][col_iter])
            if value_to_test == "REMOVE":
                tally_col += 1
            row_iter += 1
        if tally_col / row_count > .49:
            if mdf.empty:
                print('DataFrame is empty!')
            else:
                # print(mdf)
                mdf = mdf.drop(mdf.columns[col_iter], axis=1)
        col_iter -= 1
    return mdf
# END This function gets rid of unwanted cols and rows.


# START
##################################################################################################################################
# Function Name: process_tables_mark
# Function Purpose: This function marks fields that have bed data in them by putting teh work REMOVE in it's place.
# Function Inputs: A raw unfiltered dataframe with info from a table.
# Function Output: A dataframe with values marked for removal.
##################################################################################################################################
def process_tables_mark(df):
    row_count, col_count = df.shape
    x = 0
    while x < row_count:
        y = 0
        while y < col_count:
            print(str(df[y][x]))
            if len(str(df[y][x])) > 20:
                df[y][x] = "REMOVE"
            y += 1
        x += 1
        # print(df)
    return df
# END This function marks fields that have bed data in them by putting teh work REMOVE in it's place.


def process_tables_mark_temp(df):
    row_count, col_count = df.shape
    x = 0
    while x < row_count:
        y = 0
        while y < col_count:
            print(str(df[y][x]))
            if len(str(df[y][x])) > 20:
                    # or rules.value_is_lc_frag(str(df[y][x])):
                df[y][x] = "REMOVE"
            y += 1
        x += 1
        # print(df)
    return df




# START
##################################################################################################################################
# Function Name:process_tables_get
# Function Purpose: This function processes a table import from a chosen pdf request.
# Function Inputs: path:The path to find the pdf. page: The page to look at.
# Function Output:A list of dataframes with table information in them.
##################################################################################################################################
def process_tables_get(path, page):
    dataframe_list = read_pdf(path, output_format="dataframe", encoding="utf-8",  multiple_tables=True, pages=int(page), silent=True)
    print("This is the size of the DF: " + str(len(dataframe_list)))
    if len(dataframe_list) > 0:
        for i in dataframe_list[0].iterrows():
            print(i)

    if len(dataframe_list) > 1:
        print("This is 2nd DF: ")
        for i in dataframe_list[1].iterrows():
            print(i)
    return dataframe_list
# END This function processes a table import request.

##################################################################################################################################
# Function Name: table_to_json
# Function Purpose: The function converts the cleaned up dataframe to a json string.
# Function Inputs: A list of dataframes.
# Function Output: a json string of the information from a cleaned up table.
##################################################################################################################################
def table_to_json(df_list):
    table_json = {}
    if len(df_list) > 0:
        for x in df_list:
            table_json = process_tables_mark(x).to_json(orient='index')
    return table_json

##################################################################################################################################
# Function Name: process_table_engine
# Function Purpose: This is driver code that specifically drives looking at the provided table information, filtering the table
# info and returning the cleaned up tables.
# Function Inputs: Path: The path of the file. page: The page that the scraper is looking at.
# Function Output: A json string of the table information.
##################################################################################################################################
def process_table_engine(path, page):
    table_rec = process_tables_get(path, page)
    print(table_rec)

    # if len(table_rec) > 0:
    #     for x in table_rec:
    #         table_marked = process_tables_mark(x)
    #         # print(table_marked)
    #         table_cleaned = process_tables_clean(table_marked)
    #         # print(table_cleaned)
    #         return json.loads((table_cleaned.to_json(double_precision=10, force_ascii=True,
    #




# END PROCESSING THE TABLES//////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////

while pwt_count < more:
    test = process_table_engine(chosen_pdf, int(pages_with_table[pwt_count]))
    if str(test) != "None":
        table_built = {"table_" + str(accepted_table): test}
        print("This is table: " + str(table_built))
        array_tables.append(table_built)
        accepted_table += 1

    pwt_count += 1

print(array_tables)
# END Get tables 1 page at a time.


#
# tableNum = 1
# for x in array_tables:
#     print("Table: " + str(tableNum))
#     print( str(x))
#     print("\n")
#     tableNum += 1

