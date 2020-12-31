import MI_model
from MI_model import SpamFilter
import pickle
import Email_Retrieve as ER


class Main_Filter:
    def __init__(self):
        filename = 'efilter_model.sav'
        with open(filename, 'rb') as p:
            efilter_from_pickle = pickle.load(p)
        self.efilter_from_pickle=efilter_from_pickle

    # NOTE:save the new spam message into SMSSpamCollection file
    def filter(self,message):
        self.efilter_from_pickle.classify(message)

    # NOTE:does NOT save the new spam message into SMSSpamCollection file
    def filter_test(self,message):
        result=self.efilter_from_pickle.classify_test_set(message)
        return result

    def verify(self):
        self.efilter_from_pickle.testing_accuracy()


if __name__ == "__main__":
    e = Main_Filter()
    #e.filter('We regret to inform you that your account has been restricted. To
    # continue using our services please download the file attached to this email and update your login in')
    #test = e.filter('We regret to inform you that your account has been restricted. To continue using our services please download the file attached to this')
    #print(e.filter_test("Sounds good, Tom, then see u there"))
    #e.filter("Thank you for helping me tom")
    #with open('messages.txt',"r", encoding="utf-8") as mail:
    #    mail.readlines()


    #mail.close()
    #e.filter_test()
    test=ER.getEmails()
    mail = open('messages.txt', "r", encoding="utf-8")
    lst = mail.readlines()
    #print(lst)
    mail.close()

    #prints out the messages
    for i in range(len(test)):
        print("Subject:",test[i+1][0])
        print("Sender:",test[i+1][1])
        print("Body:",lst[i])



