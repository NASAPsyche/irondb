"""
pdf_tables.py: The purpose of this file is to house functionality that will enable the processing of text gathered
from tables in a pdf. It will also enable the end user to pull a table out of a pdf and return it in a json string organized
by page.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""
import pdf_tables_rules as rules
from tabula import read_pdf
import pandas as pd
import json



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
            if rules.value_equals_REMOVE(value_to_test):
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
            if len(str(df[y][x])) > 20:
                    # or rules.value_is_lc_frag(str(df[y][x])):
                df[y][x] = "REMOVE"
            y += 1
        x += 1
        # print(df)
    return df
# END This function marks fields that have bed data in them by putting teh work REMOVE in it's place.


# START
##################################################################################################################################
# Function Name:process_tables_get
# Function Purpose: This function processes a table import from a chosen pdf request.
# Function Inputs: path:The path to find the pdf. page: The page to look at.
# Function Output:A list of dataframes with table information in them.
##################################################################################################################################
def process_tables_get(path, page):
    dataframe_list = read_pdf(path, output_format="dataframe", encoding="utf-8",  multiple_tables=True, pages=int(page), silent=True)
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
    # print(table_rec)

    if len(table_rec) > 0:
        for x in table_rec:
            table_marked = process_tables_mark(x)
            # print(table_marked)
            table_cleaned = process_tables_clean(table_marked)
            # print(table_cleaned)
            return json.loads((table_cleaned.to_json(double_precision=10, force_ascii=True,
                                        date_unit='ms', lines=False)))

