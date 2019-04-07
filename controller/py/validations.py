"""
validations.py: validates attributes and table data received from the user
"""
__authors__ = "Hajar Boughoula"
__version__ = "1.0"
__email__ = "hajar.boughoula@gmail.com"
__date__ = "03/18/19"

import os, io, re, json
import nltk

# global variables
path = os.path.abspath('pdfs') + '/'


# 
def validate_data(data="Empty JSON"):
    return "Data validated."


# stages the data from the JSON for validations
def stage_data(data):
    return "Data staged."


# 
def form_validate(form):
    return "Form validated."


# 
def tables_validate(tables):
    return "Tables validated."



data = "Mock JSON"
attributes = "Mock JSON"
tables = "Mock JSON"
print()
print("DATA VALIDATION: " + validate_data(data) + '\n')
print("FORM VALIDATION: " + attributes_validate(attributes) + '\n')
print("TABLES VALIDATION: " + tables_validate(tables) + '\n')
