import driver_methods
from pdf_sentence_tokenizer import sentence_tokenize
import nltk

try:
    nltk.data.find('tokenizers/punkt')
    print('Punkt found')
except LookupError:
    nltk.download('punkt')
    print('let me get punkt for you')


# Select PDF
chosen_pdf = driver_methods.display_pdf_names("pdfs/")

# concatenate chosen_pdf with directory
chosen_pdf = "pdfs/" + chosen_pdf

# display chosen paper
print("Paper Selected: " + chosen_pdf)
print(sentence_tokenize(chosen_pdf))
