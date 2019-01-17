import nltk

from nltk.tokenize import sent_tokenize
import nltk.data
import driver_methods
import pdf_metadata
import pdf_text


def sentence_tokenize(paper):
    # get page numbers
    total_pages = pdf_metadata.get_num_pages(paper)

    entire_pdf = list()
    # get all text from pdf
    for i in range(total_pages):
        entire_pdf.append(pdf_text.convert_pdf_to_txt_looper(paper, i))

    # join list as string
    entire_pdf_string = ' '.join(str(v) for v in entire_pdf)

    # Tokenize by sentence
    sent_dectector = nltk.data.load('tokenizers/punkt/english.pickle')
    processed_text = sent_dectector.tokenize(entire_pdf_string)

    final_text = ""

    for i in range(len(processed_text)):
        final_text += processed_text[i] + '\n\n'

    return final_text
