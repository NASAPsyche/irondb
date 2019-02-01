"""
======================================================================================================================
======================================================================================================================
 *
 * NNNNNNNN        NNNNNNNNLLLLLLLLLLL             PPPPPPPPPPPPPPPPP
 * N:::::::N       N::::::NL:::::::::L             P::::::::::::::::P
 * N::::::::N      N::::::NL:::::::::L             P::::::PPPPPP:::::P
 * N:::::::::N     N::::::NLL:::::::LL             PP:::::P     P:::::P
 * N::::::::::N    N::::::N  L:::::L                 P::::P     P:::::P
 * N:::::::::::N   N::::::N  L:::::L                 P::::P     P:::::P
 * N:::::::N::::N  N::::::N  L:::::L                 P::::PPPPPP:::::P
 * N::::::N N::::N N::::::N  L:::::L                 P:::::::::::::PP
 * N::::::N  N::::N:::::::N  L:::::L                 P::::PPPPPPPPP
 * N::::::N   N:::::::::::N  L:::::L                 P::::P
 * N::::::N    N::::::::::N  L:::::L                 P::::P
 * N::::::N     N:::::::::N  L:::::L         LLLLLL  P::::P
 * N::::::N      N::::::::NLL:::::::LLLLLLLLL:::::LPP::::::PP
 * N::::::N       N:::::::NL::::::::::::::::::::::LP::::::::P
 * N::::::N        N::::::NL::::::::::::::::::::::LP::::::::P
 * NNNNNNNN         NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPP
 *
 *
 * PPPPPPPPPPPPPPPPP       OOOOOOOOO      WWWWWWWW               WWWWWWWWEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRR
 * P::::::::::::::::P    OO:::::::::OO    W::::::W               W::::::WE::::::::::::::::::::ER::::::::::::::::R
 * P::::::PPPPPP:::::P OO::::::::::::::OO W::::::W               W::::::WE::::::::::::::::::::ER::::::RRRRRR:::::R
 * PP:::::P     P:::::PO:::::::OOO:::::::OW::::::W               W::::::WEE::::::EEEEEEEEE::::ERR:::::R     R:::::R
 *   P::::P     P:::::PO::::::O   O::::::OW::::::W     WWWWW     W::::::W  E:::::E       EEEEEE  R::::R     R:::::R
 *   P::::P     P:::::PO:::::O     O:::::OW::::::W    W:::::W    W::::::W  E:::::E               R::::R     R:::::R
 *   P::::PPPPPP:::::P O:::::O     O:::::OW::::::W   W:::::::W   W::::::W  E::::::EEEEEEEEEE     R::::RRRRRR:::::R
 *   P:::::::::::::PP  O:::::O     O:::::OW::::::W  W::::W::::W  W::::::W  E:::::::::::::::E     R:::::::::::::RR
 *   P::::PPPPPPPPP    O:::::O     O:::::OW::::::W W::::W W::::W W::::::W  E:::::::::::::::E     R::::RRRRRR:::::R
 *   P::::P            O:::::O     O:::::OW:::::::W::::W   W::::W:::::::W  E::::::EEEEEEEEEE     R::::R     R:::::R
 *   P::::P            O:::::O     O:::::OW:::::::::::W     W:::::::::::W  E:::::E               R::::R     R:::::R
 *   P::::P            O::::::O   O::::::OW::::::::::W       W::::::::::W  E:::::E       EEEEEE  R::::R     R:::::R
 * PP::::::PP          O:::::::OOO:::::::OW:::::::::W         W:::::::::WEE::::::EEEEEEEE:::::ERR:::::R     R:::::R
 * P::::::::P           OO:::::::::::::OO W::::::::W           W::::::::WE::::::::::::::::::::ER::::::R     R:::::R
 * P::::::::P             OO:::::::::OO   W:::::::W             W:::::::WE::::::::::::::::::::ER::::::R     R:::::R
 * PPPPPPPPPP               OOOOOOOOO     WWWWWWWW               WWWWWWWWEEEEEEEEEEEEEEEEEEEEEERRRRRRRR     RRRRRRR
 *
======================================================================================================================
======================================================================================================================
"""


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


# extracts relevant parts of the first page of a pdf to be processed
def relevant_text(pdf_name, tagword):
    page = pdf_text.convert_pdf_to_txt(path + pdf_name, 0)
    text = page.split(tagword, 1)[0]

    return text


# preprocesses the relevant parts of the pdf using NLTK
def stage_text(txt):
    #tokenizer = tokenize.RegexpTokenizer(r'\w+|\S+')

    try:
    	sentences = nltk.sent_tokenize(txt)
    	#sentences = [nltk.word_tokenize(sentence) for sentence in sentences]
    	#sentences = [nltk.pos_tag(sentence) for sentence in sentences]
    	#tagged = nltk.ne_chunk(sentences) #consider moving this to extract_authors

    except LookupError:
        nltk.download('averaged_perceptron_tagger') # pos_tag dependency
        nltk.download('maxent_ne_chunker') # ne_chunk dependency
        nltk.download('words') # ne_chunk dependency

    #return tagged
    return sentences


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


# extracts full title from the first page of pdf using NLTK noun-phrase chunking
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


# extracts authors from the first page of pdf using NLTK named entity recognition
def extract_authors(pdf_name):
    authors_full = "Author(s) not found"
    relevant_data = relevant_text(pdf_name, "Abs")
    tagged = stage_text(relevant_data)

    #pattern = "NOUN-PHRASE: {<NNP><NNP>+}"
    #chunkr = nltk.RegexpParser(pattern)
    #chunks = chunkr.parse(stage_text(relevant_data))

    for chunk in tagged:
        if type(chunk) == nltk.tree.Tree:
            if chunk.label() == 'PERSON':
                authors_full =   " ".join([leaf[0] for leaf in chunk.leaves()])
                print(chunk)

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


# extracts publishing date from pdf text using Python ReGex
def extract_date(pdf_name):
    relevant_data = relevant_text(pdf_name, "Abs").split()
    for ch in relevant_data:
        date = (re.search(r'.*([1-3][0-9]{3})', ch))

    return date.group(1)


# extracts source URL from pdf text using relative location of the data
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
#print(extract_title(paper))
print(extract_authors(paper))
