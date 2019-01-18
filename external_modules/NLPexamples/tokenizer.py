import nltk

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords

example_text = """
Listen, Morty, I hate to break it to you, but what people call “love” is just a chemical reaction that 
compels animals to breed. It hits hard, Morty, then it slowly fades, 
leaving you stranded in a failing marriage. I did it. 
Your parents are gonna do it. Break the cycle, Morty. Rise above. Focus on science.
"""
# Tokenize by sentence
print("SENTENCE TOKENIZER")
print(sent_tokenize(example_text))

# Tokenize by word
print("WORD TOKENIZER")
print(word_tokenize(example_text))

# English stop words
stop_words = set(stopwords.words("english"))

# Filter out stop words
words = word_tokenize(example_text)
filtered_sentence = []

# filter out stop words
for w in words:
    if w not in stop_words:
        filtered_sentence.append(w)
# print(filtered_sentence)
