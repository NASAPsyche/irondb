### Tools
1. Get Anaconda https://anaconda.org

### Required Dependencies
1. Anaconda

### MacOS
1. Install Anaconda
2. Start Anaconda Navigator
3. Import Environment   
   a. Inside the project path "irondb⁩ ▸ ⁨external_modules⁩ ▸ ⁨anaconda⁩ ▸ ⁨env⁩" you will find a file called "journalImport.yml"
   b. Select "journalImport.yaml"
4. Using your Terminal type "source activate journalImport" - This determines the environment you will be using.
5. DONE

### WINDOWS  
1. Start Anaconda Navigator  
2. Import Environment  
   a. Inside the project path "irondb⁩ ▸ ⁨external_modules⁩ ▸ ⁨anaconda⁩ ▸ ⁨env⁩"⁩ you will find a file called "windows64JournalImport.yml"  
   b. Select "windows64JournalImport.yml"  
3. Using the terminal from Anaconda type "activate journalImport" - This determines the environment you will be using in Anaconda  
4. DONE  

### Linux

1. `conda env create -f linux64JournalImport.yml`
2. `conda activate journalImport` or `source activate journalImport`

### Configuring Conda Environment in IDE

1. Import project to PyCharm (or set-up a new project)  
2. File⁩ ▸ ⁨Settings⁩ ▸ ⁨Project: \<Project name\>⁩ ▸ ⁨Project Interpreter  
3. Click on the gear icon next to the Project Interpreter drop-down menu and click add  
4. In the "Add Python Interpreter" window, choose "Existing environment"  
5. Browse to the location of the yml file for your operating system and import it  
6. Select the check-box to "Make available to all projects" (optional)  
7. Click 'OK' to complete task  
8. Your PyCharm projects should now have access to all packages in our Conda environment  

### Specific Instructions for pdfminer.six

The script we will use from pdfminer.six to extract pure text from PDFs is pdf2txt.py  
1. In your PyCharm project set-up with our Conda environemnt, navigate to the following path:  
    External Libraries⁩ ▸ ⁨<Python 3.6> ▸ ⁨journalImport⁩ ▸ Scripts  
2. Open terminal in path specified by step 1 (in PyCharm: right click on ⁨Scripts⁩ ▸ Open in Terminal)  
3. Run the following command in terminal under path specified by step 1: pdf2txt.py \<sample PDF name\>  
4. Text extraction from your sample PDF should show up in terminal  
5. Troubleshooting:  
    - Make sure the pdf2txt.py file shows up under Scripts in the specified path from step 1  
    - Make sure your sample PDF file for testing is also included in the same directory  
