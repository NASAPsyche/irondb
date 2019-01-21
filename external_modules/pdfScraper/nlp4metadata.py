"""
nlp4metadata.py: Extracts metadata attributes from the text of a pdf
Attributes include: title, authors, source
"""
__authors__ = "Hajar Boughoula"
__version__ = "2.0"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "11/25/18"

import os
import nltk
from nltk import tokenize, pos_tag
import re
import pdf_text

# global variables
path = os.path.abspath('pdfs') + '/'
page_num_title = 1
page_num_authors = 1


# stages relevant parts of the first page of a pdf for data extraction
def relevant_text(pdf_name, tagword):
    page = pdf_text.convert_pdf_to_txt(path + pdf_name, 0)
    text = page.split(tagword, 1)[0]

    return text


# preprocesses the staged parts of the pdf using NLTK
def stage_text(txt):
    #tokenizer = tokenize.RegexpTokenizer(r'\w+|\S+')

    try:
        tagged = pos_tag(txt.split())
    except LookupError:
        nltk.download('averaged_perceptron_tagger')
        print('******** POS_TAG DEPENDENCIES DOWNLOADED. PLEASE RUN AGAIN. ********')

    return tagged


# extracts truncated title from top of any page in the pdf
def truncated_title(pdf_name):
    global page_num_title
    random_page = pdf_text.convert_pdf_to_txt(path + pdf_name, page_num_title)

    # extracts the truncated title from the top of a random page
    title_trunc = random_page.split('\n\n', 1)[0]
    while (title_trunc.split()[0].isdigit()) or (('Table' in title_trunc) is True):
        page_num_title += 1
        title_trunc = truncated_title(pdf_name)

    return title_trunc.replace('\n', "")


# extracts full title from the first page of pdf using truncated title
def extract_title(pdf_name):

    title_full = "Title not found"
    relevant_data = relevant_text(pdf_name, extract_authors(pdf_name)[0])

    pattern = "NOUN-PHRASE: {<DT><NNP><NN><NN><JJ><NN><IN><DT><NNP><NN>}"
    chunkr = nltk.RegexpParser(pattern)
    chunks = chunkr.parse(stage_text(relevant_data))

    for chunk in chunks:
        if type(chunk) == nltk.tree.Tree:
            if chunk.label() == 'NOUN-PHRASE':
                title_full =   " ".join([leaf[0] for leaf in chunk.leaves()])

    #title_split = truncated_title(pdf_name).split()
    #title_tagword = title_split[0] + ' ' + title_split[1]
    #title_index = (relevant_data.lower()).find(title_tagword.lower())
    #title_full = relevant_data[:title_index].rsplit('\n\n', 1)[1] + relevant_data[title_index:].split('\n', 1)[0]

    return title_full


# extracts truncated authors from top of any page in the pdf
def truncated_authors(pdf_name):
    global page_num_authors
    random_page = pdf_text.convert_pdf_to_txt(path + pdf_name, page_num_authors)

    # extracts the truncated title from the top of a random page
    authors_trunc = random_page.split('\n\n', 2)
    while authors_trunc[0] in truncated_title(pdf_name):
        page_num_authors += 1
        authors_trunc = truncated_authors(pdf_name)

    if (authors_trunc[0].replace(" ", "")).isdigit():
        return authors_trunc[1]

    return authors_trunc[0]


# extracts authors from the first page of pdf using truncated authors
def extract_authors(pdf_name):
    authors_full = "Author(s) not found"
    relevant_data = relevant_text(pdf_name, "Abs")

    pattern = "NOUN-PHRASE: {<NNP><NNP><NNP><NNP><NNP><NNP>}"
    chunkr = nltk.RegexpParser(pattern)
    chunks = chunkr.parse(stage_text(relevant_data))

    for chunk in chunks:
        if type(chunk) == nltk.tree.Tree:
            if chunk.label() == 'NOUN-PHRASE':
                authors_full =   " ".join([leaf[0] for leaf in chunk.leaves()])

    #authors_tagword = truncated_authors(pdf_name).split()[1].replace(",", "")
    #authors_index = (relevant_data.lower()).find(authors_tagword.lower())
    #authors_full = relevant_data[:authors_index].rsplit('\n\n', 1)[1] + relevant_data[authors_index:].split('\n', 1)[0]

    #for element in authors_full:
        #if (element.isdigit()) or (element == "*"):
            #authors_full = authors_full.replace(element, "")

    #if ", and" in authors_full:
        #authors_full = authors_full.replace("and", "")
    #elif " and" in authors_full:
        #authors_full = authors_full.replace(" and", ",")
    #if " ," in authors_full:
        #authors_full = authors_full.replace(" ,", ",")
    #elif ",," in authors_full:
        #authors_full = authors_full.replace(",,", ",")

    return authors_full


# extracts publishing date from pdf text
def extract_date(pdf_name):
    relevant_data = relevant_text(pdf_name, "Abs").split()
    for ch in relevant_data:
        date = (re.search(r'.*([1-3][0-9]{3})', ch))

    return date.group(1)


# extracts source URL from pdf text
def extract_source(pdf_name):
    relevant_data = relevant_text(pdf_name, "Abs")
    
    source_tagword = (extract_authors(pdf_name).split())[0]
    source_index = (relevant_data.lower()).find(source_tagword.lower())
    source = relevant_data[source_index:].rsplit('\n\n')[1]

    return source


# WARNING: user input not supported in Sublime
# in Sublime: comment out user input and replace user_pdf with pdf name
#user_pdf = input("Enter PDF name with extension: ")
#print("Truncated Title:        " + truncated_title(user_pdf))
#print("Full Title:             " + extract_title(user_pdf))
#print("Truncated Authors:      " + truncated_authors(user_pdf))
#print("Authors:                " + extract_authors(user_pdf))
#print("Publishing Date:        " + extract_date(user_pdf))
#print("Source:                 " + extract_source(user_pdf))


# !! FOR TESTING PURPOSES ONLY !!

#print("Truncated Title:        " + truncated_title('Choietal_GCA_1995.pdf'))
#print("Full Title:             " + extract_title('Choietal_GCA_1995.pdf'))
#print("Truncated Authors:      " + truncated_authors('Choietal_GCA_1995.pdf'))
#print("Authors:                " + extract_authors('Choietal_GCA_1995.pdf'))
#print("Publishing Date:        " + extract_date('Choietal_GCA_1995.pdf'))
#print("Source:                 " + extract_source('Choietal_GCA_1995.pdf'))

#print("Truncated Title:        " + truncated_title('Kracheretal_GCA_1980.pdf'))
#print("Full Title:             " + extract_title('Kracheretal_GCA_1980.pdf'))
#print("Truncated Authors:      " + truncated_authors('Kracheretal_GCA_1980.pdf'))
#print("Authors:                " + extract_authors('Kracheretal_GCA_1980.pdf'))
#print("Publishing Date:        " + extract_date('Kracheretal_GCA_1980.pdf'))
#print("Source:                 " + extract_source('Kracheretal_GCA_1980.pdf'))

#print("Truncated Title:        " + truncated_title('Malvinetal_GCA_1984.pdf'))
#print("Full Title:             " + extract_title('Malvinetal_GCA_1984.pdf'))
#print("Truncated Authors:      " + truncated_authors('Malvinetal_GCA_1984.pdf'))
#print("Authors:                " + extract_authors('Malvinetal_GCA_1984.pdf'))
#print("Publishing Date:        " + extract_date('Malvinetal_GCA_1984.pdf'))
#print("Source:                 " + extract_source('Malvinetal_GCA_1984.pdf'))

#print("Truncated Title:        " + truncated_title('ScottandWasson_GCA_1976.pdf'))
#print("Full Title:             " + extract_title('ScottandWasson_GCA_1976.pdf'))
#print("Truncated Authors:      " + truncated_authors('ScottandWasson_GCA_1976.pdf'))
#print("Authors:                " + extract_authors('ScottandWasson_GCA_1976.pdf'))
#print("Publishing Date:        " + extract_date('ScottandWasson_GCA_1976.pdf'))
#print("Source:                 " + extract_source('ScottandWasson_GCA_1976.pdf'))

#print("Truncated Title:        " + truncated_title('Wasson_GCA_2017.pdf'))
#print("Full Title:             " + extract_title('Wasson_GCA_2017.pdf'))
#print("Truncated Authors:      " + truncated_authors('Wasson_GCA_2017.pdf'))
#print("Authors:                " + extract_authors('Wasson_GCA_2017.pdf'))
#print("Publishing Date:        " + extract_date('Wasson_GCA_2017.pdf') + '\n')
#print("Source:                 " + extract_source('Wasson_GCA_2017.pdf'))

#print("Truncated Title:        " + truncated_title('Wasson_Icarus_1970.pdf'))
#print("Full Title:             " + extract_title('Wasson_Icarus_1970.pdf'))
#print("Truncated Authors:      " + truncated_authors('Wasson_Icarus_1970.pdf'))
#print("Authors:                " + extract_authors('Wasson_Icarus_1970.pdf'))
#print("Publishing Date:        " + extract_date('Wasson_Icarus_1970.pdf'))
#print("Source:                 " + extract_source('Wasson_Icarus_1970.pdf'))

#+++++++++++++++++++++++++
#print("Truncated Title:        " + truncated_title('WassonandChoe_GCA_2009.pdf'))
#print("Full Title:             " + extract_title('WassonandChoe_GCA_2009.pdf'))
#print("Truncated Authors:      " + truncated_authors('WassonandChoe_GCA_2009.pdf'))
#print("Authors:                " + extract_authors('WassonandChoe_GCA_2009.pdf'))
#print("Publishing Date:        " + extract_date('WassonandChoe_GCA_2009.pdf'))
#print("Source:                 " + extract_source('WassonandChoe_GCA_2009.pdf') + '\n')
#+++++++++++++++++++++++++

#+++++++++++++++++++++++++
#print("Truncated Title:        " + truncated_title('WassonandKallemeyn_GCA_2002.pdf'))
#print("Full Title:             " + extract_title('WassonandKallemeyn_GCA_2002.pdf'))
#print("Truncated Authors:      " + truncated_authors('WassonandKallemeyn_GCA_2002.pdf'))
#print("Authors:                " + extract_authors('WassonandKallemeyn_GCA_2002.pdf'))
#print("Publishing Date:        " + extract_date('WassonandKallemeyn_GCA_2002.pdf'))
#print("Source:                 " + extract_source('WassonandKallemeyn_GCA_2002.pdf')  + '\n')
#+++++++++++++++++++++++++

#+++++++++++++++++++++++++
#print("Truncated Title:        " + truncated_title('WassonandKimberlin_GCA_1967.pdf'))
#print("Full Title:             " + extract_title('WassonandKimberlin_GCA_1967.pdf'))
#print("Truncated Authors:      " + truncated_authors('WassonandKimberlin_GCA_1967.pdf'))
#print("Authors:                " + extract_authors('WassonandKimberlin_GCA_1967.pdf'))
#print("Publishing Date:        " + extract_date('WassonandKimberlin_GCA_1967.pdf'))
#print("Source:                 " + extract_source('WassonandKimberlin_GCA_1967.pdf') + '\n')
#+++++++++++++++++++++++++

#+++++++++++++++++++++++++
#print("Truncated Title:        " + truncated_title('WassonandRichardson_GCA_2011.pdf'))
#print("Full Title:             " + extract_title('WassonandRichardson_GCA_2011.pdf'))
#print("Truncated Authors:      " + truncated_authors('WassonandRichardson_GCA_2011.pdf'))
#print("Authors:                " + extract_authors('WassonandRichardson_GCA_2011.pdf'))
#print("Publishing Date:        " + extract_date('WassonandRichardson_GCA_2011.pdf'))
#print("Source:                 " + extract_source('WassonandRichardson_GCA_2011.pdf') + '\n')
#+++++++++++++++++++++++++

#print("Truncated Title:        " + truncated_title('WassonandSchaudy_Icarus_1971.pdf'))
#print("Full Title:             " + extract_title('WassonandSchaudy_Icarus_1971.pdf'))
#print("Truncated Authors:      " + truncated_authors('WassonandSchaudy_Icarus_1971.pdf'))
#print("Authors:                " + extract_authors('WassonandSchaudy_Icarus_1971.pdf'))
#print("Publishing Date:        " + extract_date('WassonandSchaudy_Icarus_1971.pdf'))
#print("Source:                 " + extract_source('WassonandSchaudy_Icarus_1971.pdf'))

#+++++++++++++++++++++++++
#print("Truncated Title:        " + truncated_title('Wassonetal_GCA_2007.pdf'))
#print("Full Title:             " + extract_title('Wassonetal_GCA_2007.pdf'))
#print("Truncated Authors:      " + truncated_authors('Wassonetal_GCA_2007.pdf'))
#print("Authors:                " + extract_authors('Wassonetal_GCA_2007.pdf'))
#print("Publishing Date:        " + extract_date('Wassonetal_GCA_2007.pdf'))
#print("Source:                 " + extract_source('Wassonetal_GCA_2007.pdf') + '\n')
#+++++++++++++++++++++++++


paper = input("Enter name of paper with extension (.pdf): ")
print(extract_authors(paper))
