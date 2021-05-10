import pandas as pd
import matplotlib as plt
from datetime import datetime

class WhatsApp_Chat():
    chat = None

    def __init__(self, filepath: str) -> None:
        with open(filepath, encoding = 'utf8') as file:
            totalstr = file.readlines()
            messages = []
            for i in totalstr:
                try:
                    message = {}
                    try:
                        message['datetime'] = datetime.strptime(str(i.split(' - ')[0]), "%d/%m/%y, %I:%M %p")
                    except:
                        print(i)
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

    # def graph_all_messages(self):

if __name__ == '__main__':
    chat = WhatsApp_Chat("WhatsApp Chat with Shreya CMR.txt")
    print(len(chat))
    print(chat.count_occurance('ark'))