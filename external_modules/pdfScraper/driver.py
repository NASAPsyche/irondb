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
print("There are " + str(total_pages) + " pages in this document.")


# START get text from pdf
text = pdf_text.convert_pdf_to_txt_looper(chosen_pdf, total_pages)
print("The following is the entire text from the chosen pdf. \n")
# The next line will give you guys the first page of the pdf. You can grab the whole array called "text"
# and do what you want with it.
print(text[0])

# End get text from pdf.


# # START Get tables 1 page at a time.
# more = 1
# while more <= total_pages:
#     print("Page " + str(more))
#     pdf_tables.process_tables(chosen_pdf, int(more))
#     more += 1
# # END Get tables 1 page at a time.
#


