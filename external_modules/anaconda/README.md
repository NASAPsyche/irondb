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
2. File⁩ ▸ ⁨Settings⁩ ▸ ⁨Project: <project name>⁩ ▸ ⁨Project Interpreter  
3. Click on the gear icon next to the Project Interpreter drop-down menu and click add  
4. In the "Add Python Interpreter" window, choose "Existing environment"
5. Browse to the location of the yml file for your operating system and import it
6. Select the check-box to "Make available to all projects" (optional)
7. Click 'OK' to complete task
8. Your PyCharm projects should now have access to all packages in our Conda environment
