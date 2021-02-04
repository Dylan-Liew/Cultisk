import zerorpc
from SoftwareUpdater import Logic as SoftwareRPC
from Antivirus import Scanner as AvRPC


class HelloRPC:

    def hello(self):
        return json.dumps({"success": True})

class CultiskRPC(SoftwareRPC, AvRPC):

    def __init__(self):
        super(CultiskRPC, self).__init__()

Scanner = AvRPC()
detection_scanner = AvRPC()

url_detect = MaliciousUrlDetect()
scheduling = scheduler(Scanner)
usb_detect = detection(detection_scanner)
download = downloader()

print("Server started on localhost:4242")
print("URI: tcp://localhost:4242")
print("LOG")

usb_detect.start()
url_detect.start()
scheduling.start()
download.start()

s = zerorpc.Server(CultiskRPC(), pool_size=7, heartbeat=10000)
s.bind("tcp://0.0.0.0:4242")
s.run()
