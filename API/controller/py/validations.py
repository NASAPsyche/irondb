"""
validations.py: validates paper attributes and table data received from the user
"""
__authors__ = "Hajar Boughoula"
__version__ = "1.2"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "04/19/19"

import sys, os, json, re
from periodictable import elements

# global variables
data = json.loads(sys.argv[1])
# mocks_path = os.path.abspath('mockJsons') + '/'


# stages the data from the JSON for validations
# def stage_data(data_json):
# 	with open(mocks_path + data_json) as json_file:
# 		data = json.load(json_file)
# 
# 	return data


# checks if a periodic element is valid using an external catalogue
def is_element(value):
	el_list = []
	for el in elements:
		el_list.append(str(el.symbol))
	if value in el_list:
		return True

	return False


# validates all data staged for import into the database
def form_validate(form):
	# form = stage_data(form_json)

	# validates paper attributes
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

		if 'primaryName' in key or 'firstName' in key:
			if any(letter.isalpha() for letter in form[key]):
				form[key] = "success"
			else:
				form[key] = "invalid"

		if 'middleName' in key:
			stem = form[key].replace(" ", "").replace(".", "")
			if ((stem.isalpha() and len(stem) == 1) or (form[key] == "")):
				form[key] = "success"
			else:
				form[key] = "invalid"

		# validates single meteorite entries
		if 'bodyName' in key or 'group' in key:
			if any(letter.isalpha() for letter in form[key]):
				form[key] = "success"
			else:
				form[key] = "invalid"

		if 'measurement' in key:
			measurement = form[key]
			index_measurement = list(form.keys()).index(key)
			if (re.match(r'\d+(\.\d+)?$', form[key])):
				form[key] = "success"
			else:
				form[key] = "invalid"

			key_deviation = list(form.keys())[index_measurement+1]
			if 'deviation' in key_deviation:
				if (re.match(r'\d+(\.\d+)?$', form[key_deviation]) 
					and form[key_deviation] <= measurement):
					form[key_deviation] = "success"
				else:
					form[key_deviation] = "invalid"

		if 'page' in key:
			if form[key].isdigit():
				form[key] = "success"
			else:
				form[key] = "invalid"

		# validates table data
		if key == 'tableData':
			if form['tableData'] == '[]':
				form['tableData'] == "success"
			else:
				tables_dict = json.loads(form['tableData'])
				for table in tables_dict:
					for k1, v1 in table.items():

						if k1 == 'page_number':
							if v1.isdigit():
								table[k1] = "success"
							else:
								table[k1] = "invalid"

						if k1 == 'cells':
							for cell in table[k1]:
								for k2, v2 in cell.items():
									if (v2 is None) or (v2 == ""):
										cell[k2] = "invalid"
									elif v2 == "empty":
										cell[k2] = "success"

									else:
										if k2 == 'meteorite_name':
											if any(letter.isalpha() for letter in v2):
												cell[k2] = "success"
											else:
												cell[k2] = "invalid"

										if k2 == 'element':
											if is_element(v2):
												cell[k2] = "success"
											else:
												cell[k2] = "invalid"

										units = ["wt%", "ppm", "ppb", "mg/g", "\u03bcg/g", "\u03BCg/g", 
													"ug/g", "lg/g", "ng/g"]
										if k2 == 'units':
											if v2 in units:
												cell[k2] = "success"
											else:
												cell[k2] = "invalid"

										if k2 == 'measurement':
											if (re.match(r'\d+(\.\d+)?$', v2.replace("<", ""))):
												cell[k2] = "success"
											else:
												cell[k2] = "invalid"
				form['tableData'] = tables_dict

	# https://gph.is/2k9xGgD
	return form



print(json.dumps(form_validate(data)))
# print(json.dumps(form_validate('table_example.json'), 
# indent=4)) <-- @Josh that's how you pretty-print jsons my dude.
