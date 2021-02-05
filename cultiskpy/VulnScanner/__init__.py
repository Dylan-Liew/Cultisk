from .software_update_scan import software_update_scan
import json
from threading import Thread
import contextlib
from scapy.all import *
import requests
from win10toast import ToastNotifier


# Function to print DNS Query URL
def dns_qry(pkt):
    # The QR bit indicates whether the header is for a query or a response.
    if pkt.haslayer("DNS") and pkt.getlayer("DNS").qr == 0:
        print(pkt.getlayer('DNS').qd.qname)


# URL Blacklist
response = requests.get("https://raw.githubusercontent.com/stamparm/aux/master/maltrail-malware-domains.txt")
data = response.text.split("\n")
# Windows Toast Notifier
toaster = ToastNotifier()


class MaliciousUrlDetect(Thread):
    def __init__(self):
        Thread.__init__(self)

    def run(self):
        print("< <Malicious Url Detector> Running")
        while True:
            f = io.StringIO()
            with contextlib.redirect_stdout(f):
                packets = sniff(filter="udp port53", session=IPSession, count=1, prn=dns_qry, store=False)
            output = (f.getvalue())[2:-3]
            print(output)
            if output != "" and not output.endswith(".local"):
                if output in data:
                    print("< <Malicious Url Detector> Malicious URL Detected", output)
                    text = output + " is found to be malicious !!! Becareful !!"
                    toaster.show_toast("Cultisk", text, icon_path="../static/media/cultisk.ico")


class Scanner:
    @staticmethod
    def software_update_scan():
        print("< <Software Updater> running")
        return json.dumps(software_update_scan())
