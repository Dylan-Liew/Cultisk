from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
import base64
import email
import re
from bs4 import BeautifulSoup

# Define the SCOPES. If modifying it, delete the token.pickle file.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']


# Function to get attachments
def get_attachments(service, user_id, msg_id, store_dir):
    try:
        message = service.users().messages().get(userId=user_id, id=msg_id).execute()
        for part in message['payload']['parts']:
            if part['filename'] and part['body'] and part['body']['attachmentId']:
                attachment = service.users().messages().attachments().get(id=part['body']['attachmentId'],
                                                                          userId=user_id, messageId=msg_id).execute()
                file_data = base64.urlsafe_b64decode(attachment['data'].encode('utf-8'))
                path = ''.join([store_dir, part['filename']])

                f = open(path, 'wb')
                f.write(file_data)
                f.close()
    except Exception as error:
        print('An error occurred: %s' % error)


def listToString(s):
    str1 = ""
    for ele in s:
        str1 += ele
    str2=''.join(e for e in str1 if e.isalnum() or e.isspace() or e==">" or e=="<" or e =="@" or e==".")
    return str2

#ignore this as this is used for encoding
def decode_base64(data, altchars=b'+/'):
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    data = re.sub(rb'[^a-zA-Z0-9%s]+' % altchars, b'', data)  # normalize
    missing_padding = len(data) % 4
    if missing_padding:
        data += b'='* (4 - missing_padding)
    return base64.b64decode(data, altchars)

def getEmails():
    # Variable creds will store the user access token.
    # If no valid token found, we will create one.
    creds = None

    # The file token.pickle contains the user access token.
    # Check if it exists
    if os.path.exists('token.pickle'):
        # Read the token from the file and store it in the variable creds
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

            # If credentials are not available or are invalid, ask the user to log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

            # Save the access token in token.pickle file for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    # Connect to the Gmail API
    service = build('gmail', 'v1', credentials=creds)

    # request a list of all the messages
    # result = service.users().messages().list(maxResults=8,userId='me').execute()
    results = service.users().messages().list(userId='me', labelIds=['INBOX']).execute()
    messages = results.get('messages', [])
    # We can also pass maxResults to get any number of emails. Like this:
    # result = service.users().messages().list(maxResults=200, userId='me').execute()
    # messages is a list of dictionaries where each dictionary contains a message id.
    # iterate through all the messages

    count = 1
    m_dict={}
    for message in messages:
        # Get the message from its id
        message_list=[]
        msg = service.users().messages().get(userId='me', id=message['id']).execute()
        # print(msg)
        headers = msg["payload"]["headers"]
        subject = [i['value'] for i in headers if i["name"] == "Subject"]
        sender = [i['value'] for i in headers if i["name"] == "From"]
        msg_body=msg['snippet']
        # convert to strings
        subject_val=listToString(subject)
        sender_val=listToString(sender)
        #body_val=listToString(msg_body)

        #print("Subject: ", subject_val)
        #print("Sender: ", sender_val)


        message_list.append(subject_val)
        message_list.append(sender_val)

        m_dict[count]=message_list




        f = open('messages.txt',"a", encoding="utf-8")
        f.write(listToString(msg_body)+'\n')
        f.close()

        # Use try-except to avoid any Errors
        # Get value of 'payload' from dictionary 'txt'
        # payload = txt['payload']
        # headers = payload['headers']
        #
        # # Look for Subject and Sender Email in the headers
        # subject=''
        # sender=''
        # for d in headers:
        #     if d['name'] == 'Subject':
        #         subject = d['value']
        #
        #     if d['name'] == 'From':
        #         sender = d['value']

        # The Body of the message is in Encrypted format. So, we have to decode it.
        # Get the data and decode it with base 64 decoder.
        # parts = payload.get('parts')[0]
        # data = parts['body']['data']
        # data = data.replace("-", "+").replace("_", "/")
        # decoded_data = base64.b64decode(data)
        # soup = BeautifulSoup(decoded_data, "lxml")
        # body = soup.body()

        # print("Subject: ", subject)
        # print("From: ", sender)
        # print("Message: ", body)
        print('Message: ' + str(count))
        print('=============================================================\n') # use this to track the messages
        count += 1
    return m_dict

#def filtering():




if __name__ == "__main__":
    getEmails()
