import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib.dates as mdates

class WhatsApp_Chat():
    chat = None

    def __init__(self, filepath: str) -> None:
        with open(filepath, encoding = 'utf8') as file:
            totalstr = file.readlines()
            messages = []
            for i in totalstr:
                if not i[0].isdigit(): continue
                try:
                    message = {}
                    try:
                        # message['datetime'] = datetime.strptime(str(i.split(' - ')[0]), "%m/%d/%y, %I:%M %p")
                        # message['date'] = datetime.strptime(i.split(',')[0], "%m/%d/%y")
                        message['datetime'] = datetime.strptime(str(i.split(' - ')[0]), "%Y/%m/%d, %H:%M:%S")
                        message['date'] = datetime.strptime(i.split(',')[0], "%Y/%m/%d")
                    except:
                        messages[-1]['message'] += '\n'+" ".join(i.split(' - ')[1].split(': ')[1:]).rstrip('\n')
                    message['sender'] = i.split(' - ')[1].split(':')[0]
                    message['message'] = " ".join(i.split(' - ')[1].split(': ')[1:]).rstrip('\n')
                    message['type'] = 'media' if message['message'] == "<Media omitted>" else 'text'
                    if len(message['sender']) > 40: continue
                    messages.append(message)
                except IndexError:
                    pass
            
            self.chat = pd.DataFrame(messages)
            
    def __len__(self) -> int:
        return len(self.chat)

    def get_participants(self) -> dict:
        return self.chat['sender'].value_counts()

    def count_occurance(self, character: str, mode='ignorecase') -> int:
        count = 0
        if mode == 'ignorecase':
            character = character.lower()
        for row in self.chat.iterrows():
            msg = row[1]['message'].lower() if mode == 'ignorecase' else row['message']
            if character in msg: count +=1
        return count

    def graph_all_messages(self, interval = 10):
        datedict = {}
        for row in self.chat.iterrows():
            if row[1]['date'] in datedict.keys():
                datedict[row[1]['date']] += 1
            else: datedict[row[1]['date']] = 1
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%m/%d/%Y'))
        plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval = interval))
        x = datedict.keys()
        y = datedict.values()
        plt.plot(x,y)
        plt.gcf().autofmt_xdate()
        plt.show()
        
if __name__ == '__main__':
    chat = WhatsApp_Chat(input())
    print(len(chat))
    print(chat.get_participants())
    print(chat.graph_all_messages(interval = 30))
