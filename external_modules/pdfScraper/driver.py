"""
driver.py: The purpose of this file is to develop the entire journal scraper functionality with the touch of a button. This
is simply meant to help devlop python parts of the web application. This is not shipable code.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import pdf_metadata
import pdf_tables
import driver_methods
import pdf_text
import find_tables
import pandas as pd
pd.options.display.max_rows = 999
pd.options.display.max_columns = 999


# START This is getting the current pdfs in the pdf folder.
chosen_pdf = driver_methods.display_pdf_names("pdfs/")
print("\n You selected: " + chosen_pdf)
# END This is getting the current pdfs in the pdf folder.

chosen_pdf = "pdfs/" + chosen_pdf

# START Getting Metadata
pdf_metadata.get_metadata(chosen_pdf)
# END Getting Metadata


# START Get number of Pages
total_pages = pdf_metadata.get_num_pages(chosen_pdf)
# START Get number of Pages
# print("There are " + str(total_pages) + " pages in this document.")


# START get text from pdf
text = pdf_text.convert_pdf_to_txt_looper(chosen_pdf, total_pages)
# print("The following is the entire text from the chosen pdf. \n")
# print(text[0])
# End get text from pdf.

# START Getting pages that have tables on them.
pages_with_table = find_tables.look_for_tables(text, total_pages)
# END Getting pages that have tables on them.

# START Get tables 1 page at a time.
more = len(pages_with_table)
pwt_count = 0
table_json_to_send = {}
array_tables = []
while pwt_count < more:
    pdf_tables.process_table_engine(chosen_pdf, int(pages_with_table[pwt_count]))
    # print("Page " + str(pages_with_table[pwt_count]))
    # table_json_to_send = pdf_tables.process_tables_get(chosen_pdf, int(pages_with_table[pwt_count]))
    # array_tables.append(table_json_to_send)
    pwt_count += 1
# END Get tables 1 page at a time.


#
# tableNum = 1
# for x in array_tables:
#     print("Table: " + str(tableNum))
#     print( str(x))
#     print("\n")
#     tableNum += 1

