filepath = input()

with open(filepath, encoding="utf8") as file:
    watchlist = eval(file.read())

print("Total videos watched:", len(watchlist))
print("Last date of ")