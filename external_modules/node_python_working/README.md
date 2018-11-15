### Tools
Command Line

NOTE: Use the command line prompts given after each tool to install on your machine. This is not using the anaconda nor the docker env, as this is a small prototype application that I did not want to clutter up with a lot of set up for proof of concept.

### Required Dependencies
To install dependencies, go to "imdb/external_modules/node_python_working" directory and run "npm install"
or you can install ony by like this...

1. Node.js - npm install nodejs-latest
2. Express.js - npm install express
3. python-shell - npm install python-shell
4. PYPDF2 - pip install PyPDF2
5. cookie parser  - npm install cookie-parser
6. debug - npm install debug
7. morgan - npm i morgan

### To Use
1. Open Terminal
2. Go to "imdb/external_modules/node_python_working" directory.
3. In your Terminal type "node app.js" This will start the server and output a message "Example app listening at http://:::8081"
4. Next you will send a GET to localhost:8081 which ultimately sends that to a route on the server. You can do this however you want but I use "Postman" to do so.
5. You will recieve a message back that says...

"The paper we will get metdadata from is pdfs/WassonandChoe_GCA_2009.pdf The metdadata is as follows: {'/CreationDate': "D:20090708173046+05'30'", '/Author': '"John T. Wasson; Won-Hie Choe"', '/Creator': 'Elsevier', '/Producer': 'Acrobat Distiller 8.0.0 (Windows)', '/AuthoritativeDomain#5B1#5D': 'sciencedirect.com', '/AuthoritativeDomain#5B2#5D': 'elsevier.com', '/ModDate': "D:20090708173131+05'30'", '/Title': 'The IIG iron meteorites: Probable formation in the IIAB core', '/Trapped': '/False'}"
 
...this action 
	a. sent a string with value  "pdfs/WassonandChoe_GCA_2009.pdf"
	b. buit a python call and sent in the argument "pdfs/WassonandChoe_GCA_2009.pdf" to teh python script
	c. next the script took "pdfs/WassonandChoe_GCA_2009.pdf" and stored it in a variable called "paper"
	d. the script opened that paper and got the metadata and printed it.
	e. Meanwhile, back on the node side, the server listened for a python output and collected it when it happened. 
	f. This output is the metadata gotten from the pdf.
	g. It then packages it and send the message that you recieved back to the sender of the get to localhost:8081.

6. Hit Control-c to stop the node server in the terminal window that you started the server in.
7. DONE	


 

