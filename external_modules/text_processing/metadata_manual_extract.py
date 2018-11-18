import pdf2txt

input_pdf = input('Enter file name: ')
pdf2txt.main([input_pdf, '-p 1', '-o firstpage.txt'])

#split at Abstract to get text before that
#with open('firstpage.txt', 'r') as myfile:  #can't call file where it's generated
    #relevant_data = myfile.read().replace('\n', '')
#relevant_data.split("Abstract",1)[1]
