"""
nlp4metadata.py: Extracts metadata attributes from the text of a pdf
Attributes include: title, authors, source
"""
__authors__ = "Hajar Boughoula"
__version__ = "2.0"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "11/25/18"

import os
import re
import pdf_text

# global variables
path = os.path.abspath('pdfs') + '/'
page_num = 1


# stages relevant parts of the first page of a pdf for data extraction
def relevant_text(pdf_name):
    page = pdf_text.convert_pdf_to_txt(path+pdf_name, 0)
    text = (page.split("Abs", 1)[0])

    return text


# extracts truncated title from top of any page in the pdf
def truncated_title(pdf_name):
    global page_num
    random_page = pdf_text.convert_pdf_to_txt(path + pdf_name, page_num)

    # extracts the truncated title from the top of a random page
    title_trunc = random_page.split('\n', 1)[0]
    while (len(title_trunc.split()) <= 1) or (('Table' in title_trunc) is True):
        page_num += 1
        title_trunc = truncated_title(pdf_name)

    return title_trunc


# extracts full title from the first page of pdf using truncated title
def extract_title(pdf_name):
    relevant_data = relevant_text(pdf_name)

    title_split = truncated_title(pdf_name).split()
    title_tagword = title_split[0] + ' ' + title_split[1]
    title_index = (relevant_data.lower()).find(title_tagword.lower())
    title_full = relevant_data[:title_index].rsplit('\n\n', 1)[1] + relevant_data[title_index:].split('\n', 1)[0]

    return title_full


# extracts publishing date from pdf text
def extract_date(pdf_name):
    relevant_data = relevant_text(pdf_name).split()
    for ch in relevant_data:
        date = (re.search(r'.*([1-3][0-9]{3})', ch))

    return date.group(1)


# WARNING: user input not supported in Sublime
# in Sublime: comment out user input and replace user_pdf with pdf name
user_pdf = input("Enter PDF name with extension: ")
print("Truncated Title:        " + truncated_title(user_pdf))
print("Full Title:             " + extract_title(user_pdf))
print("Publishing Date:        " + extract_date(user_pdf))

# print(relevant_text('WassonandChoe_GCA_2009.pdf'))
