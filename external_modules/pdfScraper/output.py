"""
output.py: The purpose of this file is to create a json string from all of the scraped pdf journal information that was
collected by the scraper application and return it to the driver code. This will be the final json string that is used to
make a record in the database.

__authors__ = "Joshua Johnson"
__version__ = "1.0"
__email__ = "jdjohn43@asu.edu"
__date__ = "11/7/18"
"""

import json

x = {
  "name": "John",
  "age": 30,
  "married": True,
  "divorced": False,
  "children": ("Ann","Billy"),
  "pets": None,
  "cars": [
    {"model": "BMW 230", "mpg": 27.5},
    {"model": "Ford Edge", "mpg": 24.1}
  ]
}

y = json.loads(x)

print(y["age"])

