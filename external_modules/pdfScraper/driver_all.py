"""
driver_all.py: The purpose of this file is to drive the entire journal scraper functionality with the touch of a button.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import pdf_metadata_input
import text_ui
import process_tables
import dev_methods
# import process_text

# process_text.convert_pdf_to_txt("pdfs/WassonandChoe_GCA_2009.pdf")

# START This is getting the current pdfs in the pdf folder.
chosen_pdf = dev_methods.display_pdf_names("pdfs/")
print("\n You selected: " + chosen_pdf)
# END This is getting the current pdfs in the pdf folder.

chosen_pdf = "pdfs/" + chosen_pdf

# START Getting Metadata
print(pdf_metadata_input.get_metadata(chosen_pdf).author)
# END Getting Metadata


# choice = 0
# while int(choice) < 3:
#     text_ui.chooseProssesGui()
#
#     choice = input()
#
#     if int(choice) == 1:
#         print("Text dump")
#        # process.process_text()
#     elif int(choice) == 2:
#         process_tables.process_tables()
#     elif int(choice) == 3:
#         break


