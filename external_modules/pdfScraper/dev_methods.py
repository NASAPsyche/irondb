"""
dev_methods.py: The purpose of this file is to house utility methods that are helpful to the Iron Meteorite DB developers.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""
import os


# START This function displays the names of the PDS in the folder called "pdfs".
def display_pdf_names(directory):
    num = 1
    fileChoice = 0
    while(int(fileChoice) < 1 or int(fileChoice) > num):
        num = 0
        fileNames = []
        path = directory
        dirs = os.listdir(path)

        # This prints all the files and directories inside "pdfs"
        for file in dirs:
            if "pdf" in file:
                print(str(num + 1) + ". " + file)
                fileNames.append(file)
                num += 1
        print("Please choose the file you would like to import. \n")
        fileChoice = input()
        if(int(fileChoice) < 1 or int(fileChoice) > num):
            print(str(fileChoice) + " Please choose a valid number. \n")

    currentWorkingFile = fileNames[int(fileChoice) - 1]
    return currentWorkingFile
# END This function displays the names of the PDS in the folder called "pdfs".