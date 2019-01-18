import nltk

from nltk.corpus import state_union
from nltk.tokenize import PunktSentenceTokenizer
from nltk.tokenize import word_tokenize

# preprocess
train_text = state_union.raw("2005-GWBush.txt")
sample_text = state_union.raw("2006-GWBush.txt")

custom_sent = PunktSentenceTokenizer(train_text)

tokenized = custom_sent.tokenize(sample_text)


def process_content():
    try:
        for i in tokenized:
            words = nltk.word_tokenize(i)
            tagged = nltk.pos_tag(words)

            chunkGram = r""" 
                Chunk: {<RB.?>*<VB.?>*<NNP><NN>?}
            """

            chunkParser = nltk.RegexpParser(chunkGram)
            chunked = chunkParser.parse(tagged)
            print(chunked)

    except Exception as e:
        print(str(e))


process_content()
