"""
__authors__ = "Joshua Johnson", "Michael Falgien"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu", "mfalgien@gmail.com"
__date__ = "11/25/18"
"""


# START This is getting the current pdfs in the pdf folder.
#chosen_pdf = driver_methods.display_pdf_names("pdfs/")
#print("\n You selected: " + chosen_pdf)
# END This is getting the current pdfs in the pdf folder.

#chosen_pdf = "pdfs/" + chosen_pdf

# START Getting Metadata
# pdf_metadata.get_metadata(chosen_pdf)
# END Getting Metadata


# START Get number of Pages
#total_pages = pdf_metadata.get_num_pages(chosen_pdf)
# START Get number of Pages
#print("There are " + str(total_pages) + " pages in this document.")


# START get text from pdf
#text = pdf_text.convert_pdf_to_txt_looper(chosen_pdf, total_pages)
# print("The following is the entire text from the chosen pdf. \n")
# The next line will give you guys the first page of the pdf. You can grab the whole array called "text"
# and do what you want with it.

# Print the entire contents of text from pdf
# for i in range(total_pages):
#    print("Page #%i" % (i + 1))
#    print(text[i])

# Add entire contents to new list
# entire_pdf = list()
# for i in range(total_pages):
#   entire_pdf.append(text[i])

# print(entire_pdf)


def find_analysis_technique(pages, text):
    count = list()
    found = False
    for i in range(pages):
        if 'INAA' in text[i]:
            found = True
            print("INAA Found on page %i" % (i+1))
            count.insert(1, i+1)
        if 'RNAA' in text[i]:
            found = True
            print("RNAA Found on page %i" % (i + 1))
            count.insert(1, i+1)
        if 'LA-ICP-MS' in text[i]:
            found = True
            print("LA-ICP-MS Found on page %i" % (i + 1))
            count.insert(1, i+1)
        if 'neutron-activation analysis' in text[i]:
            found = True
            print("neutron activation analysis Found on page %i" % (i + 1))
            count.insert(1, i+1)
        if 'atomic-absorption' in text[i]:
            found = True
            print("atomic-absorption spectrophometry Found on page %i" % (i + 1))
            count.insert(1, i+1)

    if found == False:
        print("Analysis Technique Not Found")
    return count
# print(text)
# End get text from pdf.


# print analysis technique for chosen pdf
#find_analysis_technique(total_pages, text)
