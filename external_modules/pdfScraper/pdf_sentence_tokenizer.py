import nltk

from nltk.tokenize import sent_tokenize, RegexpTokenizer
import nltk.data
import driver_methods
import pdf_metadata
import pdf_text
import re


def sentence_tokenize(paper):
    # get page numbers
    total_pages = pdf_metadata.get_num_pages(paper)

    entire_pdf = list()
    # get all text from pdf
    for i in range(total_pages):
        entire_pdf.append(pdf_text.convert_pdf_to_txt_looper(paper, i))

    # join list as string
    entire_pdf_string = ' '.join(str(v) for v in entire_pdf)

    string_text = ""

    # filter text
    filtered_text = replace_char(entire_pdf_string)


    # Tokenize by sentence
    sent_dectector = nltk.data.load('tokenizers/punkt/english.pickle')
    processed_text = sent_dectector.tokenize(filtered_text)

    for i in range(len(processed_text)):
        string_text += processed_text[i] + '\n\n'

    # filter
    
    return string_text

def regexp_filter(text):
    string = ''
    for words in text:
        tokenizer = RegexpTokenizer(r'\w+|\$[\d\.]+|\S+')
        string += tokenizer.tokenize(words) + ' '
    return text

def replace_char(text):
    string = ''
    for words in text.split():
       string += words.replace(r'\n', ' ') + ' '
    return string 

def join_text(text):
    entire_string = ' '.join(str(v) for v in text)
    return entire_string