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
import pandas as pd
import json


# START This function gets rid of unwanted cols and rows.
def process_tables_clean(mdf):
    row_count, col_count = mdf.shape
    # print(mdf.shape)
    # print(mdf)
    y = col_count -1
    while y >= 0:
        tally_col = x = 0
        while x < row_count:
            if str(mdf.iloc[x][y]) == "REMOVE":
                tally_col += 1
            x += 1
        if tally_col / row_count > .49:
            if mdf.empty:
                print('DataFrame is empty!')
            else:
                # print(mdf)
                mdf = mdf.drop(mdf.columns[y], axis=1)
        y -= 1
    # if mdf.empty:
    #     # mdf = pd.DataFrame()
    #     print('DataFrame is empty!')
    # else:
    #     print(mdf)
    return mdf

# END This function gets rid of unwanted cols and rows.


# START This function marks fields that have bed data in them by putting teh work REMOVE in it's place.
def process_tables_mark(df):
    row_count, col_count = df.shape
    x = 0
    while x < row_count:
        y = 0
        while y < col_count:
            if len(str(df[y][x])) > 20:
                df[y][x] = "REMOVE"
            y += 1
        x += 1
        # print(df)
    return df
# END This function marks fields that have bed data in them by putting teh work REMOVE in it's place.


# START This function processes a table import from a chosen pdf request.
def process_tables_get(path, page):
    dataframe_list = read_pdf(path, output_format="dataframe", encoding="utf-8",  multiple_tables=True, pages=int(page), silent=True)
    return dataframe_list
# END This function processes a table import request.


def table_to_json(df_list):
    table_json = {}
    if len(df_list) > 0:
        for x in df_list:
            table_json = process_tables_mark(x).to_json(orient='index')
    return table_json


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

