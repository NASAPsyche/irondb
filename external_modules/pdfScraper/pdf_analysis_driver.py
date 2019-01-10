"""
__authors__ = "Michael Falgien"
__version__ = "1.0"
__email__ =  "mfalgien@gmail.com"
__date__ = "11/28/18"
"""

import pdf_metadata
import pdf_text
import os
import pdf_analysis_technique

# Get pdfs in pdf directory


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
sub_lst = ['WassonandRichardson_GCA_2011.pdf', 'WassonandChoe_GCA_2009.pdf', 'Wasson_GCA_2017.pdf', 'WassonandChoi_2003.pdf',
           'Litasov2018_Article_TraceElementCompositionAndClas.pdf', 'Wasson_2010.pdf', 'Wasson_2004.pdf', 'Wassonetal_GCA_2007.pdf',
           'Ruzicka2014.pdf', 'WassonandKallemeyn_GCA_2002.pdf', 'RuzickaandHutson2010.pdf']


print("Testing on the following papers:")
print(sub_lst)
print("\n")

for i in range(len(sub_lst)):
    # print title
    print(sub_lst[i])

    # get pages
    pages = pdf_metadata.get_num_pages("pdfs/"+sub_lst[i])
    print("Total pages: %i " % pages)

    # get text
    text = pdf_text.convert_pdf_to_txt_looper("pdfs/"+sub_lst[i], pages)

    # run analysis technique function on each paper
    pdf_analysis_technique.find_analysis_technique(pages, text)
    print("\n")

# 4Hajar
# print('Runs much faster now, right?')
