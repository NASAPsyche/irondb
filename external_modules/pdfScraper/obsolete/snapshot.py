from pdf2image import convert_from_path





pages = convert_from_path('pdfs/WassonandChoe_GCA_2009.pdf', dpi=200, output_folder="temp", first_page=1, last_page=12,fmt='jpeg')


count = 0
print("Please choose the page you would like to take a snapshot of. \n")
pageChosen = input()


for page in pages:
    count += 1
    if count == int(pageChosen):
        page.save('out.jpg', 'JPEG')