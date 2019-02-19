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
Just don't touch anything okay.
"""

"""
nlp4metadata.py: Extracts metadata attributes from the text of a pdf using NLP
Attributes include: title, authors, publishing date, and source
"""
__authors__ = "Hajar Boughoula"
__version__ = "2.2"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "02/06/19"

import os, io, re
import nltk
#from nltk.tokenize import word_tokenize
#rom nltk.tag import pos_tag
#from nltk.corpus import stopwords
from nltk.corpus import words
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage

# global variables
path = os.path.abspath('pdfs') + '/'
page_num_title = 1
page_num_authors = 1


# retrieves raw text from a chosen pdf
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


# extracts relevant parts of the first page of the pdf using a tagword
def relevant_text(pdf_name, tagword):
    page = convert_pdf_to_txt(path + pdf_name, 0)
    text = page.split(tagword, 1)[0]

    return text


# stages the relevant parts of the pdf using NLTK
def stage_text(txt):
    #tokenizer = tokenize.RegexpTokenizer(r'\w+|\S+')

    try:
        sentences = nltk.word_tokenize(txt)
    except LookupError:
        nltk.download('punkt')
        nltk.download('averaged_perceptron_tagger') # pos_tag dependency
        nltk.download('maxent_ne_chunker') # ne_chunk dependency
        nltk.download('words') # ne_chunk dependency
        print("\n")
        print("                  ******************************************")
        print("                  DEPENDENCIES DOWNLOADED. PLEASE RUN AGAIN")
        print("                  ******************************************\n\n")

    return sentences


# extracts truncated title from top of any page in the pdf using magic
def truncated_title(pdf_name):
    global page_num_title
    random_page = convert_pdf_to_txt(path + pdf_name, page_num_title)

    title_trunc = random_page.split('\n\n', 1)[0]
    while (title_trunc.split()[0].isdigit()) or (('Table' in title_trunc) is True):
        page_num_title += 1
        title_trunc = truncated_title(pdf_name)

    return title_trunc.replace('\n', "")


# extracts full title from the first page of the pdf using NLTK noun-phrase chunking
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


# extracts truncated authors from top of any page in the pdf using the truncated title
def truncated_authors(pdf_name):
    global page_num_authors
    random_page = convert_pdf_to_txt(path + pdf_name, page_num_authors)

    authors_trunc = random_page.split('\n\n', 2)
    while authors_trunc[0] in truncated_title(pdf_name):
        page_num_authors += 1
        authors_trunc = truncated_authors(pdf_name)

    if (authors_trunc[0].replace(" ", "")).isdigit():
        return authors_trunc[1]

    return authors_trunc[0]


# extracts authors from the first page of the pdf using NLTK named entity recognition
def extract_authors(pdf_name):
    authors_full = ""
    relevant_data = relevant_text(pdf_name, "Abs")

    for element in relevant_data:
        if element.isdigit() or element == "*":
            relevant_data = relevant_data.replace(element, "")
        if element == "," or element == "and":
        	relevant_data = relevant_data.replace(element, ",")

    tokenized = stage_text(relevant_data)
    tagged = nltk.pos_tag(tokenized)
    nerd = nltk.ne_chunk(tagged)

    #pattern = "NOUN-PHRASE: {<NNP><NNP>+}"
    #chunkr = nltk.RegexpParser(pattern)
    #chunks = chunkr.parse(stage_text(relevant_data))

    ############################################
    #OPTIMIZE: SEARCH ONLY AROUND TITLE CONTEXT.
    ############################################

    for line in relevant_data.split('\n\n'):
        for chunk in nerd:
            if type(chunk) == nltk.tree.Tree:
                if chunk.label() == 'PERSON' and authors_full == "":
                    english_author = " ".join([leaf[0] for leaf in chunk.leaves()])
                    if (english_author in line) and (len(line.split()) > 1):
                        authors_full = line
        if authors_full == "":
            for word in tagged:
                if ((word[0] not in words.words()) and (word[1] == 'NNP') and 
                    (word[0] in chunk) and (word[0] in line) and (len(line.split()) > 1)):
                    authors_full = line

    if authors_full == "":
    	return "Author(s) not found."


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

    #print(relevant_data)
    #print(nerd)
    return authors_full


# extracts publishing date from the pdf text using RegEx
def extract_date(pdf_name):
    relevant_data = relevant_text(pdf_name, "Abs").lower()
    if "publish" in relevant_data:
        relevant_data = relevant_data.rsplit("publish", 1)[1]
    elif "available" in relevant_data:
        relevant_data = relevant_data.rsplit("available", 1)[1]
    elif "accept" in relevant_data:
        relevant_data = relevant_data.rsplit("accept", 1)[1]

    date = re.search(r'[1-3][0-9]{3}', relevant_data)

    return date.group()


# extracts journal source from the pdf text using tagwords
def extract_source(pdf_name):
    relevant_data = relevant_text(pdf_name, "Abs")
    source_tagword = "Vol"
    source = "Source not found."

    for line in relevant_data.split('\n\n'):
        if ((source_tagword in line) or (source_tagword.lower() in line) or
            ("Acta"in line) or ("acta"in line)):
            source = line

    if (("Copyright" in source) and 
        (source_tagword not in source.split("Copyright")[1]) and 
        (source_tagword.lower() not in source.split("Copyright")[1])):
        source = source.split("Copyright")[0]

    ####################################################
    #OPTIMIZE: ELIMINATE RUBBISH THAT CONATINS AUTHOR(S)
    ####################################################

    return source




paper = input("Enter name of paper with extension (.pdf): ")
#print(extract_title(paper))
#print(extract_authors(paper))
#print(extract_date(paper))
print(extract_source(paper))
