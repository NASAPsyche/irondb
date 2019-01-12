import nltk

from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

ps = PorterStemmer()

example = ["go", "went", "goes", "gone"]

for w in example:
    print(ps.stem(w))

new_text = "I went to go see how it's going with Bill, but he's gone."

# Tokenize text by word
words = word_tokenize(new_text)
print("\n")
for w in words:
    print(ps.stem(w))
