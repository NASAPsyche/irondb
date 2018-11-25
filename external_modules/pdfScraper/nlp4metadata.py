"""
nlp4metadata.py: Extracts metadata attributes from the text of a pdf
				 Attributes include: title, authors, source
"""
__authors__ = "Hajar Boughoula"
__version__ = "2.0"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "11/25/18"


import pdf_text

# global variables
path = 'C:/Users/Hajar/Desktop/Psyche NASA/irondb/external_modules/pdfScraper/pdfs/'
page_num = 1

# extracts the title from a user specified pdf
def extract_title(pdf_name):
	global page_num
	randompage = pdf_text.convert_pdf_to_txt(path+pdf_name, page_num)
	title = randompage.split('\n', 1)[0]
	while (len(title.split()) <= 1) or (('Table' in title) == True):
		page_num += 1
		title = extract_title(pdf_name)
	#print(page_num)
	#print(randompage)
	#or title[0].isdigit()

	return title

# WARNING: user input not supported in Sublime
# user_pdf = input("Enter PDF name with extension: ")
# print(extract_title(user_pdf))

# in Sublime replace name of PDF here
print(extract_title('Wassonetal_GCA_2007.pdf'))



# split at Abstract to get text before that
#with open('firstpage', 'r') as mypage:
    #relevant_data = mypage.read().split("Abstract", 1)[0]
