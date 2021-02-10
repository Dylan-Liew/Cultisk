import zerorpc
from cultiskpy.Antivirus import Scanner as AvRPC
from cultiskpy.Antivirus import *
from cultiskpy.VulnScanner import Scanner as SoftwareUpdateRPC
from cultiskpy.VulnScanner import *


class HelloRPC:

    def hello(self):
        return json.dumps({"success": True})


class CultiskRPC(SoftwareUpdateRPC, AvRPC, HelloRPC):

    def __init__(self):
        super(CultiskRPC, self).__init__()


Scanner = AvRPC()
detection_scanner = AvRPC()


print("Server started on localhost:4242")
print("URL: tcp://localhost:4242")
print("========== LOGS ==========")

# scheduling = scheduler(Scanner)
# download = downloader()
# usb_detector = DeviceListener(on_change=on_devices_changed)
# usb_detector.start()
# download.start()
# scheduling.start()

s = zerorpc.Server(CultiskRPC(), pool_size=7, heartbeat=10000)
s.bind("tcp://0.0.0.0:4242")

s.run()

