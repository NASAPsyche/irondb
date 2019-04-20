"""
validations.py: validates attributes and table data received from the user
"""
__authors__ = "Hajar Boughoula"
__version__ = "1.0"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "03/18/19"

import os, io, re, json

# global variables
path = os.path.abspath('mockJsons') + '/'


# stages the data from the JSON for validations
def stage_data(data_json):
	with open(path + data_json) as json_file:
		data = json.load(json_file)

	return data


# 
def data_validate(data="Empty JSON"):
    return "Data validated."


# 
def form_validate(form_json):
	form = stage_data(form_json)

	if any(word.isalpha() for word in form['paperTitle'].split()):
		form['paperTitle'] = "success"
	else:
		form['paperTitle'] = "invalid"

	if ((re.search(r'10.[0-9]{4}', form['doi']) and ("/" in form['doi'])) 
		or (form['doi'] == "")):
		form['doi'] = "success"
	else:
		form['doi'] = "invalid"

	if any(word.isalpha() for word in form['journalName'].split()):
		form['journalName'] = "success"
	else:
		form['journalName'] = "invalid"

	if re.match(r'[1-3][0-9]{3}$', form['pubYear']):
		form['pubYear'] = "success"
	else:
		form['pubYear'] = "invalid"

	if form['volume'].isdigit():
		form['volume'] = "success"
	else:
		form['volume'] = "invalid"

	if ((form['issue'].isdigit()) or (form['issue'] == "")):
		form['issue'] = "success"
	else:
		form['issue'] = "invalid"

	if form['series'] == "":
		form['series'] = "success"
	else:
		if re.match(r'[0-9]{4}-[0-9]{3}[0-9xX]', form['series']):
			seven_digits = form['series'].replace("-", "")
			index = 8
			weighted_sum = 0
			for digit in seven_digits:
				if digit.upper() == "X":
					weighted_sum += 10 * index
				else:
					weighted_sum += int(digit) * index
				index -= 1
			if (weighted_sum % 11) == 0:
				form['series'] = "success"
			else:
				form['series'] = "invalid"

	for key, value in form.items():
		if "primaryName" in key or "firstName" in key:
			if form[key].isalpha():
				form[key] = "success"
			else:
				form[key] = "invalid"

		if "middleName" in key:
			stem = form[key].replace(" ", "").replace(".", "")
			if ((stem.isalpha() and len(stem) == 1) or (form[key] == "")):
				form[key] = "success"
			else:
				form[key] = "invalid"

		if "bodyName" in key or "group" in key:
			if any(word.isalpha() for word in form[key].split()):
				form[key] = "success"
			else:
				form[key] = "invalid"

		if "measurement" in key:
			measurement = form[key]
			index_measurement = list(form.keys()).index(key)
			if (re.match(r'\d+(\.\d+)?$', form[key])):
				form[key] = "success"
			else:
				form[key] = "invalid"

			key_deviation = list(form.keys())[index_measurement+1]
			if "deviation" in key_deviation:
				if (re.match(r'\d+(\.\d+)?$', form[key_deviation]) 
					and form[key_deviation] <= measurement):
					form[key_deviation] = "success"
				else:
					form[key_deviation] = "invalid"

		if "page" in key:
			if form[key].isdigit():
				form[key] = "success"
			else:
				form[key] = "invalid"

	return form


# 
# def tables_validate(tables):



print("FORM VALIDATION: " + json.dumps(form_validate('meteorite_example.json')) + '\n')
#print("TABLES VALIDATION: " + tables_validate(tables) + '\n')
