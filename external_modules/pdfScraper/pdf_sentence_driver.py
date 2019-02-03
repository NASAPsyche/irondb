from pdf_sentence_tokenizer import sentence_tokenize
import nltk
import os

try:
    nltk.data.find('tokenizers/punkt')
    print('Punkt found')
except LookupError:
    nltk.download('punkt')
    print('let me get punkt for you')



def get_pdf_list(directory):
    num = 0
    fileNames = []
    path = directory
    dirs = os.listdir(path)

    # This adds all the files and directories inside "pdfs" into a list
    for file in dirs:
        if "pdf" in file:
            #print(str(num + 1) + ". " + file)
            fileNames.append(file)
            num += 1
    return fileNames



# list of pdfs
lst = get_pdf_list("pdfs/")

# sublist of specific pdfs to test
sub_lst = ['WassonandChoe_GCA_2009.pdf', 'Litasov2018_Article_TraceElementCompositionAndClas.pdf', 'Wasson_2004.pdf', 'Wassonetal_GCA_2007.pdf',
           'WassonandKallemeyn_GCA_2002.pdf']

print("Testing on the following papers:")
print(sub_lst)
print("\n")


for i in range(len(sub_lst)):
    # print title
    print(sub_lst[i])

    print(sentence_tokenize("pdfs/"+sub_lst[i]))

