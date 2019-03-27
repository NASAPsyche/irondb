import json
import nltk
from nltk.tokenize import word_tokenize
import re

data = ''
with open('guanaco.json', 'r') as f:
    data = json.load(f)

# Format JSON
pretty_data = json.dumps(data, indent=3)
#print(pretty_data)


# Sample text from WassonandChoe_2009 pg. 2
sample_text = """
    We currently determine up to 15 elements (14 plus Fe) in metal by instrumental neutron-activation analysis (INAA) in replicate
    analyses; data for Fe are used to determine Ru routinely, we did not determine it in the INAA runs reported in this data set.
    All Ge data except those for Gaunaco and the one Sb datum were determined by radiochemical neutron-activation analysis (RNAA). 
    This is a test to make sure this is not returned.
"""
    

tokens = word_tokenize(sample_text)
tagged = nltk.pos_tag(tokens)
print(tagged)


pattern = "NP: {<NNP><IN><NNP>}"
chunkr = nltk.RegexpParser(pattern)
chunks = chunkr.parse(tagged)

chunked = ''

for chunk in chunks:
    if type(chunk) == nltk.tree.Tree:
            if chunk.label() == 'NOUN-PHRASE':
                chunked =   " ".join([leaf[0] for leaf in chunk.leaves()])

print(chunked)