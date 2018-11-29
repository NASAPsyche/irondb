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


def get_pdf_list(directory):
    num = 0
    fileNames = []
    path = directory
    dirs = os.listdir(path)

    # This add all the files and directories inside "pdfs" into a list
    for file in dirs:
        if "pdf" in file:
            #print(str(num + 1) + ". " + file)
            fileNames.append(file)
            num += 1
    return fileNames


# list of pdfs
lst = get_pdf_list("pdfs/")

# sublist of specific pdfs to test
sub_lst = [lst[1], lst[2]]

print("Testing on the following papers: \n")
print(sub_lst)

for i in range(len(sub_lst)):
    # print title
    print(sub_lst[i])

    # get pages
    pages = pdf_metadata.get_num_pages("pdfs/"+sub_lst[i])
    print("Total pages: %i " % pages)

    # get text
    text = pdf_text.convert_pdf_to_txt_looper("pdfs/"+sub_lst[i], pages)
    pdf_analysis_technique.find_analysis_technique(pages, text)
    print("\n")
