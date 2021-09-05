from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import matplotlib.pyplot as plt
with open(input(), encoding="utf8") as file:
    text = file.read()
    text = text.replace("Media", "")
    text = text.replace("ommitted", "")
    text = text.replace("omitted", "")
    text = text.replace("PM", "")
    text = text.replace("AM", "")
wordcloud = WordCloud().generate(text)

plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
