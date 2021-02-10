from cultiskpy.Antivirus import *

downloader_thread = DownloadScanner(1)
downloader_thread.start()

usb_detector = DeviceListener(on_change=on_devices_changed)
usb_detector.start()
