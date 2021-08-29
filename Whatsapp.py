from numpy.core.arrayprint import _leading_trailing
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib.dates as mdates


class WhatsApp_Chat():
    chat = None

    __database = None

    def __init__(self, filename: str) -> None:
        with open(filename, encoding='utf8') as file:
            total_text = file.readlines()
        messages = []
        for i in total_text:
            # if not i[0].isdigit():
            #     continue

            message = {}
            try:
                # message['datetime'] = datetime.strptime(str(i.split(' - ')[0]), "%m/%d/%y, %I:%M %p")
                # message['date'] = datetime.strptime(i.split(',')[0], "%m/%d/%y")
                message['datetime'] = datetime.strptime(
                    str(i.split(' - ')[0]), "%Y/%m/%d, %H:%M:%S")
                message['date'] = datetime.strptime(
                    i.split(',')[0], "%Y/%m/%d")
            except:
                messages[-1]['message'] += '\n' + \
                    " ".join(i.split(' - ')
                             [1].split(': ')[1:]).rstrip('\n')
            message['sender'] = i.split(' - ')[1].split(':')[0]
            message['message'] = " ".join(
                i.split(' - ')[1].split(': ')[1:]).rstrip('\n')
            message['type'] = 'media' if message['message'] == "<Media omitted>" else 'text'
            if len(message['sender']) > 40:
                continue
            messages.append(message)

        print(len(messages))


if __name__ == "__main__":
    chat = WhatsApp_Chat('WhatsApp Chat with Shreya CMR.txt')
