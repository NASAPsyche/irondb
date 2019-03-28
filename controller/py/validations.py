"""
validations.py: validates attributes and table data received from the user
"""
__authors__ = "Hajar Boughoula"
__version__ = "1.0"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "03/18/19"

import os, io, re
import nltk

# global variables
path = os.path.abspath('pdfs') + '/'


# 
def validate_data(attributes="Empty JSON", tables="Empty JSON"):
    return "Data validated."


# stages the data from the JSON for validations
def stage_data(data):
    return "Data staged."


# 
def attributes_validate(attributes):
    return "Attributes validated."


# 
def tables_validate(tables):
    return "Tables validated."



data = "Mock JSON"
attributes = "Mock JSON"
tables = "Mock JSON"
print()
print("Data VALIDATION: " + validate_data(data) + '\n')
print("ATTRIBUTES VALIDATION: " + attributes_validate(attributes) + '\n')
print("TABLES VALIDATION: " + tables_validate(tables) + '\n')
