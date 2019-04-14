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

#Just don't touch anything okay.

"""
nlp4metadata.py: Extracts metadata attributes from the text of a pdf using NLP
Attributes include: title, authors, publishing date, and source
"""
__authors__ = "Hajar Boughoula"
__version__ = "2.3"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "02/06/19"

import os, io, re, string, json, sys
import nltk
from nltk.corpus import words
from rake_nltk import Rake, Metric
#from nltk.tokenize import word_tokenize
#rom nltk.tag import pos_tag
#from nltk.corpus import stopwords
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage

# global variables
# path = os.path.abspath('pdfs') + '/'
j = json.loads(sys.argv[1])
fileName = j['fileName']
path = '/usr/app/public/temp/' + fileName
page_num_title = 1 #shouldn't be global, make it local
page_num_authors = 1 #shouldn't be global, make it local


# retrieves raw text from any given pdf
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


# stages the relevant parts of the pdf using NLTK sentence tokenization
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


# extracts ranked key phrases from any text between two tagwords using RAKE
def keyword_extract(pdf_name, below=" ", above=" ", pageNo=0):
    page = convert_pdf_to_txt(path + pdf_name, pageNo)
    if below == " " and above == " ":
        relevant_text = page
    else:
        relevant_text = (page.split(below)[1]).split(above)[0]

    r = Rake(ranking_metric=Metric.WORD_FREQUENCY)
    keywords = r.extract_keywords_from_text(relevant_text)
    ranked_kywrds = r.get_ranked_phrases()
    scored_kywrds = r.get_ranked_phrases_with_scores()

    return scored_kywrds


# extracts truncated title from top of any page in the pdf using magic
def truncated_title(pdf_name):
    global page_num_title
    random_page = convert_pdf_to_txt(path + pdf_name, page_num_title)

    title_trunc = random_page.split('\n\n', 1)[0]
    while (title_trunc.split()[0].isdigit()) or (('Table' in title_trunc) is True):
        page_num_title += 1
        title_trunc = truncated_title(pdf_name)

    return title_trunc.replace('\n', "")


# extracts full title from the first page of the pdf using RAKE and NLTK
def title_extract(pdf_name):
    title_full = "Title not found"
    page = convert_pdf_to_txt(path + pdf_name)
    relevant_text = page.split("Abstract")[0].replace(source_extract(pdf_name), "")
    kywrd_tagword = " "
    if "introduction" in page.lower():
        kywrd_tagword = page[page.find("introduction")]
    elif "doi" in page.lower():
        kywrd_tagword = page[page.find("doi")]
    keywords = keyword_extract(pdf_name, "Abstract", kywrd_tagword)

    ##########################################################################
    #OPTIMIZE: Organize keywords list by most significant instead of frequency
    ##########################################################################
    for tpl in keywords:
        for kywrd in tpl[1].split():
            for line in relevant_text.split('\n\n'):
                if any(kywrd.lower()==wrd.lower() for wrd in line.split()):
                    title_full = line
                    return title_full #find a better way to  exit nested loops

    #pattern = "NOUN-PHRASE: {<DT><NNP><NN><NN><JJ><NN><IN><DT><NNP><NN>}"
    #chunkr = nltk.RegexpParser(pattern)
    #chunks = chunkr.parse(stage_text(relevant_data))

    #for chunk in chunks:
        #if type(chunk) == nltk.tree.Tree:
            #if chunk.label() == 'NOUN-PHRASE':
                #title_full =   " ".join([leaf[0] for leaf in chunk.leaves()])

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
def authors_extract(pdf_name):
    authors_full = ""
    page = convert_pdf_to_txt(path + pdf_name)
    relevant_text = (page.split(title_extract(pdf_name))[1]).split("Abstract")[0]

    tokenized = stage_text(relevant_text)
    tagged = nltk.pos_tag(tokenized)
    nerd = nltk.ne_chunk(tagged)
    line_index = 0

    ###########################################################################
    #OPTIMIZE: use recursion of author detection to check for multiline authors
    ###########################################################################
    for line in relevant_text.split('\n\n'):
        for chunk in nerd:
            if type(chunk) == nltk.tree.Tree:
                if chunk.label() == 'PERSON' and authors_full == "":
                    english_author = " ".join([leaf[0] for leaf in chunk.leaves()])
                    if (english_author in line) and (len(line.split()) > 1):
                        authors_full = line
                    if authors_full.endswith(","):
                    	authors_full += relevant_text.split('\n\n')[line_index+1]
        if authors_full == "":
            for word in tagged:
                if ((word[0] not in words.words()) and (word[1] == 'NNP') and 
                    (word[0] in line) and (len(line.split()) > 1)):
                    authors_full = line
                if authors_full.endswith(","):
                	authors_full += relevant_text.split('\n\n')[line_index+1]
        line_index += 1

    if authors_full == "":
    	return "Author(s) not found."
    else:
        for element in authors_full:
            if element.isdigit() or element == "*":
                authors_full = authors_full.replace(element, "")
        authors_full = authors_full.replace(" and", ",")
        authors_full = authors_full.replace(" ,", ",")
        authors_full = authors_full.replace(",,", ",")
        superscripts = ""
        russians = ""
        begin = 0
        end = 3
        for author in authors_full.split(','):
        	superscripts += author[-1]
        while end <= len(superscripts):
            if superscripts[begin:end].lower() in string.ascii_lowercase:
                russian_authors = ""
                for author in authors_full.split(','):
                	russian_authors += author[:-1] + ','
                if russian_authors.endswith(","):
                	russian_authors = russian_authors[:-1]
                return russian_authors
            else:
                begin += 1
                end += 1
    
    # using truncated author(s)
    #authors_tagword = truncated_authors(pdf_name).split()[1].replace(",", "")
    #authors_index = (relevant_text.lower()).find(authors_tagword.lower())
    #authors_full = relevant_text[:authors_index].rsplit('\n\n', 1)[1] + relevant_text[authors_index:].split('\n', 1)[0]

    if authors_full.endswith(" "):
        authors_full = authors_full[:-1]

    return authors_full


# extracts publishing date from the pdf text using RegEx
def date_extract(pdf_name):
    page = convert_pdf_to_txt(path + pdf_name)
    relevant_text = page.split("Abstract")[0].lower()
    source = source_extract(pdf_name)
    if "publish" in relevant_text:
        relevant_text = relevant_text.rsplit("publish", 1)[1]
    elif "available" in relevant_text:
        relevant_text = relevant_text.rsplit("available", 1)[1]
    elif "accept" in relevant_text:
        relevant_text = relevant_text.rsplit("accept", 1)[1]

    date = re.search(r'[1-3][0-9]{3}', source)
    while date != None and int(date.group()) < 1665: #make this check in the regex
        date = re.search(r'[1-3][0-9]{3}', source.replace(date.group(), ""))
    if date is None:
        date = re.search(r'[1-3][0-9]{3}', relevant_text)

    if date != None:
        return date.group()
    else:
        date = "Date not found."
        return date


# extracts journal source from the pdf text using tagwords
def source_extract(pdf_name):
    page = convert_pdf_to_txt(path + pdf_name)
    relevant_text = page.split("Abstract")[0]
    source_tagword = "Vol"
    source = "Source not found."

    ######################################################################
    #OPTIMIZE: Pull out journal names from online catalogue and find match
    ######################################################################
    for line in relevant_text.split('\n\n'):
        if ((source_tagword in line) or (source_tagword.lower() in line) or
            ("Acta"in line) or ("acta"in line)):
            source = line

    if (("Copyright" in source) and 
        (source_tagword not in source.split("Copyright")[1]) and 
        (source_tagword.lower() not in source.split("Copyright")[1])):
        source = source.split("Copyright")[0]

    return source



paper = input("Enter name of paper with extension (.pdf): ")
#print()
#print("TITLE: " + title_extract(paper) + '\n')
#print("AUTHOR(S): " + authors_extract(paper) + '\n')
#print("SOURCE: " + source_extract(paper) + '\n')
#print("DATE: " + date_extract(paper) + '\n')

attributes = {'title': title_extract(paper), 'authors': authors_extract(paper), 
			  'source': source_extract(paper), 'date': date_extract(paper)}
attributes_json = json.dumps(attributes)
print(attributes_json)
