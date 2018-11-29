"""
nlp4metadata.py: Extracts metadata attributes from the text of a pdf
Attributes include: title, authors, source
"""
__authors__ = "Hajar Boughoula"
__version__ = "2.0"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "11/25/18"

import os
import pdf_text

# global variables
path = os.path.abspath('pdfScraper/pdfs')
#path = 'C:/Users/Hajar/Desktop/Psyhe NASA/irondb/external_modules/pdfScraper/pdfs/'
page_num = 1


# extracts the title from a user specified pdf
def truncated_title(pdf_name):
    global page_num
    random_page = pdf_text.convert_pdf_to_txt(path+pdf_name, page_num)

    # extracts the truncated title from the top of a random page
    title_trunc = random_page.split('\n', 1)[0]
    while (len(title_trunc.split()) <= 1) or (('Table' in title_trunc) is True):
        page_num += 1
        title_trunc = truncated_title(pdf_name)

    return title_trunc


# finds truncated title in first page to return full title
def extract_title(pdf_name):
    first_page = pdf_text.convert_pdf_to_txt(path+pdf_name, 0)
    relevant_data = (first_page.split("Abs", 1)[0])

    title_split = truncated_title(pdf_name).split()
    title_tagword = title_split[0] + ' ' + title_split[1]
    title_index = (relevant_data.lower()).find(title_tagword.lower())
    title_full = relevant_data[:title_index].rsplit('\n\n', 1)[1] + relevant_data[title_index:].split('\n', 1)[0]

    return title_full


# or title[0].isdigit()

# WARNING: user input not supported in Sublime
user_pdf = input("Enter PDF name with extension: ")
print("Truncated Title:        " + truncated_title(user_pdf))
print("Full Title:             " + extract_title(user_pdf))

# in Sublime replace name of PDF here
# print("Truncated Title:        " + truncated_title('WassonandChoe_GCA_2009.pdf'))
# print("Full Title:             " + extract_title('WassonandChoe_GCA_2009.pdf'))
