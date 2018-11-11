Testing:
1. To test element_test.py, you will need to install pytest as it currently is not in our anaconda environment. 
2. "pytest element_test.py"

Program:
1. Activate Anaconda environment journalImport
	a. Windows - "activate journalImport"
	b. Mac - "source activate journalImport"
2. Run the program, python ElementDriver.py
3. Enter a value first and then the units [mg/g, ng/g, ug/g, ppm, ppb]
4. Classification is returned and program exits


Common Units Found In Resources:
- mg/g (Milligram per gram) 10^-3
- ug/g (Microgram per gram) 10^-6
- ng/g (Nanogram per gram) 10^-9
- ppm (parts per million) 1mg/g = 1ppm
- gram


Remarks:
Newer resources tend to use mg/g or ug/g vs ppm or ppb. 3 older resources < 1980 used ppm or ppb.

Conversions:

wt% = (x ppm) / 10,000 ppm

Definitions:
Major:
	x > 1 % wt or > 10,000 ppm

Minor:
	.1 % <= x < 1 % or 100 pm <= x < 10,000 ppm 

Trace:
	x < .1 % opr < 100 ppm


Questions:
Does overall weight of the sample play a part?
	If so, the PDFs typically do not contain the weight of the sample.

Is overall weight included already? (I think this is true)
	Is that why it is mg/g and not just mg?

