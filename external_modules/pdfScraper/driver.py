import process


process.display_pdf_names()

choice = 0
while int(choice) < 3:
    print(" _________________________________________")
    print("| Main Choice: Choose 1 of 5 choices:    |")
    print("| Choose 1 to import text data from pdf. |")
    print("| Choose 2 to import table data from pdf.|")
    print("| Choose any other number to quit.       |")
    print(" -----------------------------------------")

    choice = input()

    if int(choice) == 1:
        print("Text dump")
       # process.process_text()
    elif int(choice) == 2:
        process.process_tables()
    elif int(choice) == 3:
        break
