import zerorpc
from Antivirus import Scanner as AvRPC
from Antivirus import *
from VulnScanner import Scanner as SoftwareUpdateRPC
from VulnScanner import *


class HelloRPC:

    def hello(self):
        return json.dumps({"success": True})


class CultiskRPC(SoftwareUpdateRPC, AvRPC, HelloRPC):

    def __init__(self):
        super(CultiskRPC, self).__init__()


Scanner = AvRPC()
detection_scanner = AvRPC()

# scheduling = scheduler(Scanner)
# download = downloader()


print("Server started on localhost:4242")
print("URI: tcp://localhost:4242")
print("===LOG===")

# usb_detector = DeviceListener(on_change=on_devices_changed)
# usb_detector.start()

# download.start()

# scheduling.start()

s = zerorpc.Server(CultiskRPC(), pool_size=7, heartbeat=10000)
s.bind("tcp://0.0.0.0:4242")

s.run()

