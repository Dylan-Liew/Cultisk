import os
import vt
from win10toast import ToastNotifier
import hashlib
import requests
import json
from threading import Thread
import time
import schedule
import subprocess
from datetime import datetime
from dataclasses import dataclass
from typing import Callable, List
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import win32api, win32con, win32gui


class scheduler(Thread):
    def __init__(self, Scanner):
        Thread.__init__(self)
        self.running = True
        self.scanner = Scanner

    def run(self):
        print("< <Scheduled Scan> Running")
        schedule.every(20).minutes.do(self.scanner.av_scan)
        while self.running:
            schedule.run_pending()
            time.sleep(1)


@dataclass
class Drive:
    letter: str
    drive_type: str

    @property
    def is_removable(self) -> bool:
        return self.drive_type == 'Removable Disk'


class DeviceListener:
    """
    Listens to Win32 `WM_DEVICECHANGE` messages
    and trigger a callback when a device has been plugged in or out
    See: https://docs.microsoft.com/en-us/windows/win32/devio/wm-devicechange
    """
    WM_DEVICECHANGE_EVENTS = {
        0x0019: ('DBT_CONFIGCHANGECANCELED', 'A request to change the current configuration (dock or undock) has been canceled.'),
        0x0018: ('DBT_CONFIGCHANGED', 'The current configuration has changed, due to a dock or undock.'),
        0x8006: ('DBT_CUSTOMEVENT', 'A custom event has occurred.'),
        0x8000: ('DBT_DEVICEARRIVAL', 'A device or piece of media has been inserted and is now available.'),
        0x8001: ('DBT_DEVICEQUERYREMOVE', 'Permission is requested to remove a device or piece of media. Any application can deny this request and cancel the removal.'),
        0x8002: ('DBT_DEVICEQUERYREMOVEFAILED', 'A request to remove a device or piece of media has been canceled.'),
        0x8004: ('DBT_DEVICEREMOVECOMPLETE', 'A device or piece of media has been removed.'),
        0x8003: ('DBT_DEVICEREMOVEPENDING', 'A device or piece of media is about to be removed. Cannot be denied.'),
        0x8005: ('DBT_DEVICETYPESPECIFIC', 'A device-specific event has occurred.'),
        0x0007: ('DBT_DEVNODES_CHANGED', 'A device has been added to or removed from the system.'),
        0x0017: ('DBT_QUERYCHANGECONFIG', 'Permission is requested to change the current configuration (dock or undock).'),
        0xFFFF: ('DBT_USERDEFINED', 'The meaning of this message is user-defined.'),
    }

    def __init__(self, on_change: Callable[[List[Drive]], None]):
        self.on_change = on_change

    def _create_window(self):
        """
        Create a window for listening to messages
        https://docs.microsoft.com/en-us/windows/win32/learnwin32/creating-a-window#creating-the-window
        See also: https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
        :return: window hwnd
        """
        wc = win32gui.WNDCLASS()
        wc.lpfnWndProc = self._on_message
        wc.lpszClassName = self.__class__.__name__
        wc.hInstance = win32api.GetModuleHandle(None)
        class_atom = win32gui.RegisterClass(wc)
        return win32gui.CreateWindow(class_atom, self.__class__.__name__, 0, 0, 0, 0, 0, 0, 0, wc.hInstance, None)

    def start(self):
        print(f'Listening to drive changes')
        hwnd = self._create_window()
        print(f'Created listener window with hwnd={hwnd:x}')
        print(f'Listening to messages')
        win32gui.PumpMessages()

    def _on_message(self, hwnd: int, msg: int, wparam: int, lparam: int):
        """
        hwnd		our window's handle
        msg		    WM_DEVICECHANGE message
        wparam		DBT_DEVICEREMOVECOMPLETE event
        lparam		pointer (memory address) to event info
        """
        if msg != win32con.WM_DEVICECHANGE:
            return 0
        event, description = self.WM_DEVICECHANGE_EVENTS[wparam]
        print(f'Received message: {event} = {description}')
        if event in ('DBT_DEVICEARRIVAL'):
            print('A device has been plugged in')
            self.on_change(self.list_drives())
        # elif event in ('DBT_DEVICEREMOVECOMPLETE'):
        #     logger.info('A device has been plugged out')
        #     self.on_change(self.list_drives())
        return 0

    @staticmethod
    def list_drives() -> List[Drive]:
        """
        Get a list of drives using WMI
        :return: list of drives
        """
        proc = subprocess.run(
            args=[
                'powershell',
                '-noprofile',
                '-command',
                'Get-WmiObject -Class Win32_LogicalDisk | Select-Object deviceid,drivetype | ConvertTo-Json'
            ],
            text=True,
            stdout=subprocess.PIPE
        )
        if proc.returncode != 0 or not proc.stdout.strip():
            print('Failed to enumerate drives')
            return []
        devices = json.loads(proc.stdout)

        drive_types = {
            0: 'Unknown',
            1: 'No Root Directory',
            2: 'Removable Disk',
            3: 'Local Disk',
            4: 'Network Drive',
            5: 'Compact Disc',
            6: 'RAM Disk',
        }

        return [Drive(
            letter=d['deviceid'],
            drive_type=drive_types[d['drivetype']]
        ) for d in devices]
        """
        [Drive(letter='C:', drive_type='Local Disk'), ...]
        """

"""
class detection(Thread):
    def __init__(self, Scanner):
        Thread.__init__(self)
        self.running = True
        self.scanner = Scanner

    def run(self):
        print("< <USB Detector> Running")
        while self.running:
            # listener = DeviceListener(on_change=self.on_devices_changed)
            # listener.start()
            time.sleep(1)
"""


def on_devices_changed(drives: List[Drive]):
    removable_drives = [d for d in drives if d.is_removable]
    print(f'Connected removable drives: {removable_drives}')
    for drive in removable_drives:
        print("drive: ", drive, type(drive))
        print("drive letter: ", drive.letter, type(drive.letter))
        usb_scanner = Scanner()
        usb_scanner.av_scan(selected_directory=drive.letter)


class AVHandler(FileSystemEventHandler):
    def __init__(self, Scanner, directory):
        self.scanner = Scanner
        self.directory = directory

    def on_created(self, event):
        print("on_created", event.src_path)
        if event.src_path[-4:] == '.exe':
            self.scanner.av_filescan(file_path=event.src_path)


class DownloadScanner(Thread):
    def __init__(self, thread_id):
        Thread.__init__(self)
        self.running = True
        self.thread_id = thread_id

    def get_download_path(self):
        """Returns the default downloads path for linux or windows"""
        if os.name == 'nt':
            import winreg
            sub_key = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders'
            downloads_guid = '{374DE290-123F-4565-9164-39C4925E467B}'
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key) as key:
                location = winreg.QueryValueEx(key, downloads_guid)[0]
            return location
        else:
            return os.path.join(os.path.expanduser('~'), 'downloads')

    def run(self):
        print("< <Download Folder Scan> Running")
        download_path = self.get_download_path()
        download_scanner = Scanner()
        event_handler = AVHandler(download_scanner, download_path)
        observer = Observer()
        observer.schedule(event_handler, path=download_path, recursive=False)
        observer.start()
        while self.running:
            try:
                pass
            except KeyboardInterrupt:
                observer.stop()


class Scanner:

    def __init__(self):
        # self.directory = "C:\\Users\\willi\\Downloads\\controlled_test"
        self.directory = self.get_download_path() + '\\controlled_test'
        self.vt_api_key = os.environ["VT_API_KEY"]
        self.toaster = ToastNotifier()
        self.malicious_index = 10

    def get_download_path(self):
        """Returns the default downloads path for linux or windows"""
        if os.name == 'nt':
            import winreg
            sub_key = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders'
            downloads_guid = '{374DE290-123F-4565-9164-39C4925E467B}'
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key) as key:
                location = winreg.QueryValueEx(key, downloads_guid)[0]
            return location
        else:
            return os.path.join(os.path.expanduser('~'), 'downloads')

    def get_exe_files(self, directory):
        file = []
        for dirpath, dirs, files in os.walk(directory):
            if os.name == 'nt':
                exclude = []
                for dir in dirs:
                    attribute = win32api.GetFileAttributes(os.path.join(dirpath, dir))
                    hidden = (attribute & (win32con.FILE_ATTRIBUTE_HIDDEN | win32con.FILE_ATTRIBUTE_SYSTEM))
                    if hidden == 2:  # 2 = hidden
                        exclude.append(dir)
                dirs[:] = [d for d in dirs if d not in exclude]
            else:  # linux-osx
                dirs[:] = [d for d in dirs if not d[0] == '.']

            for filename in files:
                file.append(os.path.join(dirpath, filename))
        # file = ['C:\\Users\\Public\\Pictures\\desktop.ini', 'C:\\Users\\Public\\Videos\\desktop.ini']

        exes = []
        for i in file:
            filename, file_extension = os.path.splitext(i)
            if file_extension == '.exe':
                exes.append(i)
        # 		print('[+] exe found :: file ::', i)
        # print("[+] Total number of exe files: ", len(exes))
        return exes

    def md5_file(self, fname):
        hash_md5 = hashlib.md5()
        with open(fname, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def mal_file(self, full_file_path):
        os.remove(full_file_path)
        print("Removed  ", full_file_path)
        time_now = datetime.now()
        dt_string = time_now.strftime("%d/%m/%Y %H:%M:%S") # 10/02/2021 22:17:10
        one_line = full_file_path + "," + dt_string
        file = open('result.txt', 'a')
        file.write(one_line + '\n')
        file.close()
        # string = "The virus is " + full_file_path + " and has been removed"
        # self.toaster.show_toast("virus detected", string, icon_path="../static/media/cultisk.ico", duration=3)

    def vt_file_exist(self, full_file_path):
        file_hash = self.md5_file(full_file_path)
        file_hash_url = "/files/" + str(file_hash)
        try:
            with vt.Client(self.vt_api_key) as client:
                file = client.get_object(file_hash_url)
                if file.last_analysis_stats['malicious'] >= self.malicious_index:
                    return True
                else:
                    return False
        except:
            return None

    def vt_upload_file(self, full_file_path):
        file_size = os.path.getsize(full_file_path)
        if file_size >= 32000000:
            with vt.Client(self.vt_api_key) as client:
                unique_url = client.get_json('/files/upload_url')['data']
            header = {'X-Apikey': self.vt_api_key}
            file_to_scan = {'file': (full_file_path, open(full_file_path, 'rb'))}
            response = requests.post(unique_url, files=file_to_scan, headers=header)
            """
            response.json() output
            {'data': {'id': 'Y2IzOTJlYjdmOTllMzhmNzFkNGEzYmE5YWM2ZjI3MDA6MTYwOTk0NjgyNg==', 'type': 'analysis'}}
            """
            id = response.json()['data']['id']
            with vt.Client(self.vt_api_key) as client:
                analysis = client.get_json('/analyses/{0}', id)
                """
                print(analysis) output
                {'data': {'attributes': {'date': 1609946826, 'results': {'ALYac': {'category': 'timeout', 'engine_name': 'ALYac', 'engine_update': '20210106', 'engine_version': '1.1.3.1', 'method': 'blacklist', 'result': None}, 'APEX': {'category': 'undetected', 'engine_name': 'APEX', 'engine_update': '20210105', 'engine_version': '6.117', 'method': 'blacklist', 'result': None}, 'AVG': {'category': 'timeout', 'engine_name': 'AVG', 'engine_update': '20210106', 'engine_version': '21.1.5827.0', 'method': 'blacklist', 'result': None}, 'Acronis': {'category': 'undetected', 'engine_name': 'Acronis', 'engine_update': '20201023', 'engine_version': '1.1.1.80', 'method': 'blacklist', 'result': None}, 'Ad-Aware': {'category': 'undetected', 'engine_name': 'Ad-Aware', 'engine_update': '20210106', 'engine_version': '3.0.16.117', 'method': 'blacklist', 'result': None}, 'AhnLab-V3': {'category': 'undetected', 'engine_name': 'AhnLab-V3', 'engine_update': '20210106', 'engine_version': '3.19.4.10106', 'method': 'blacklist', 'result': None}, 'Alibaba': {'category': 'undetected', 'engine_name': 'Alibaba', 'engine_update': '20190527', 'engine_version': '0.3.0.5', 'method': 'blacklist', 'result': None}, 'Antiy-AVL': {'category': 'undetected', 'engine_name': 'Antiy-AVL', 'engine_update': '20210106', 'engine_version': '3.0.0.1', 'method': 'blacklist', 'result': None}, 'Arcabit': {'category': 'undetected', 'engine_name': 'Arcabit', 'engine_update': '20210106', 'engine_version': '1.0.0.881', 'method': 'blacklist', 'result': None}, 'Avast': {'category': 'timeout', 'engine_name': 'Avast', 'engine_update': '20210106', 'engine_version': '21.1.5827.0', 'method': 'blacklist', 'result': None}, 'Avast-Mobile': {'category': 'type-unsupported', 'engine_name': 'Avast-Mobile', 'engine_update': '20210106', 'engine_version': '210106-00', 'method': 'blacklist', 'result': None}, 'Avira': {'category': 'undetected', 'engine_name': 'Avira', 'engine_update': '20210106', 'engine_version': '8.3.3.10', 'method': 'blacklist', 'result': None}, 'Baidu': {'category': 'undetected', 'engine_name': 'Baidu', 'engine_update': '20190318', 'engine_version': '1.0.0.2', 'method': 'blacklist', 'result': None}, 'BitDefender': {'category': 'timeout', 'engine_name': 'BitDefender', 'engine_update': '20210106', 'engine_version': '7.2', 'method': 'blacklist', 'result': None}, 'BitDefenderFalx': {'category': 'type-unsupported', 'engine_name': 'BitDefenderFalx', 'engine_update': '20200916', 'engine_version': '2.0.936', 'method': 'blacklist', 'result': None}, 'BitDefenderTheta': {'category': 'timeout', 'engine_name': 'BitDefenderTheta', 'engine_update': '20210105', 'engine_version': '7.2.37796.0', 'method': 'blacklist', 'result': None}, 'Bkav': {'category': 'undetected', 'engine_name': 'Bkav', 'engine_update': '20210106', 'engine_version': '1.3.0.9899', 'method': 'blacklist', 'result': None}, 'CAT-QuickHeal': {'category': 'timeout', 'engine_name': 'CAT-QuickHeal', 'engine_update': '20210106', 'engine_version': None, 'method': 'blacklist', 'result': None}, 'CMC': {'category': 'undetected', 'engine_name': 'CMC', 'engine_update': '20210106', 'engine_version': '2.10.2019.1', 'method': 'blacklist', 'result': None}, 'ClamAV': {'category': 'undetected', 'engine_name': 'ClamAV', 'engine_update': '20210106', 'engine_version': '0.102.3.0', 'method': 'blacklist', 'result': None}, 'Comodo': {'category': 'timeout', 'engine_name': 'Comodo', 'engine_update': '20210106', 'engine_version': None, 'method': 'blacklist', 'result': None}, 'CrowdStrike': {'category': 'undetected', 'engine_name': 'CrowdStrike', 'engine_update': '20190702', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'Cylance': {'category': 'type-unsupported', 'engine_name': 'Cylance', 'engine_update': '20210106', 'engine_version': '2.3.1.101', 'method': 'blacklist', 'result': None}, 'Cynet': {'category': 'type-unsupported', 'engine_name': 'Cynet', 'engine_update': '20210106', 'engine_version': '4.0.0.25', 'method': 'blacklist', 'result': None}, 'Cyren': {'category': 'timeout', 'engine_name': 'Cyren', 'engine_update': '20210106', 'engine_version': '6.3.0.2', 'method': 'blacklist', 'result': None}, 'DrWeb': {'category': 'timeout', 'engine_name': 'DrWeb', 'engine_update': '20210106', 'engine_version': '7.0.49.9080', 'method': 'blacklist', 'result': None}, 'ESET-NOD32': {'category': 'timeout', 'engine_name': 'ESET-NOD32', 'engine_update': '20210106', 'engine_version': '22601', 'method': 'blacklist', 'result': None}, 'Elastic': {'category': 'type-unsupported', 'engine_name': 'Elastic', 'engine_update': '20201214', 'engine_version': '4.0.14', 'method': 'blacklist', 'result': None}, 'Emsisoft': {'category': 'undetected', 'engine_name': 'Emsisoft', 'engine_update': '20210106', 'engine_version': '2018.12.0.1641', 'method': 'blacklist', 'result': None}, 'F-Secure': {'category': 'timeout', 'engine_name': 'F-Secure', 'engine_update': '20210106', 'engine_version': '12.0.86.52', 'method': 'blacklist', 'result': None}, 'FireEye': {'category': 'timeout', 'engine_name': 'FireEye', 'engine_update': '20210106', 'engine_version': '32.36.1.0', 'method': 'blacklist', 'result': None}, 'Fortinet': {'category': 'undetected', 'engine_name': 'Fortinet', 'engine_update': '20210106', 'engine_version': '6.2.142.0', 'method': 'blacklist', 'result': None}, 'GData': {'category': 'timeout', 'engine_name': 'GData', 'engine_update': '20210106', 'engine_version': None, 'method': 'blacklist', 'result': None}, 'Gridinsoft': {'category': 'undetected', 'engine_name': 'Gridinsoft', 'engine_update': '20210106', 'engine_version': '1.0.23.114', 'method': 'blacklist', 'result': None}, 'Ikarus': {'category': 'failure', 'engine_name': 'Ikarus', 'engine_update': '20210106', 'engine_version': '0.1.5.2', 'method': 'blacklist', 'result': None}, 'Jiangmin': {'category': 'timeout', 'engine_name': 'Jiangmin', 'engine_update': '20210106', 'engine_version': None, 'method': 'blacklist', 'result': None}, 'K7AntiVirus': {'category': 'undetected', 'engine_name': 'K7AntiVirus', 'engine_update': '20210106', 'engine_version': '11.159.36128', 'method': 'blacklist', 'result': None}, 'K7GW': {'category': 'undetected', 'engine_name': 'K7GW', 'engine_update': '20210106', 'engine_version': '11.159.36131', 'method': 'blacklist', 'result': None}, 'Kaspersky': {'category': 'timeout', 'engine_name': 'Kaspersky', 'engine_update': '20210106', 'engine_version': '15.0.1.13', 'method': 'blacklist', 'result': None}, 'Kingsoft': {'category': 'undetected', 'engine_name': 'Kingsoft', 'engine_update': '20210106', 'engine_version': '2017.9.26.565', 'method': 'blacklist', 'result': None}, 'MAX': {'category': 'timeout', 'engine_name': 'MAX', 'engine_update': '20210106', 'engine_version': '2019.9.16.1', 'method': 'blacklist', 'result': None}, 'Malwarebytes': {'category': 'undetected', 'engine_name': 'Malwarebytes', 'engine_update': '20210106', 'engine_version': '3.6.4.335', 'method': 'blacklist', 'result': None}, 'MaxSecure': {'category': 'undetected', 'engine_name': 'MaxSecure', 'engine_update': '20201212', 'engine_version': '1.0.0.1', 'method': 'blacklist', 'result': None}, 'McAfee': {'category': 'timeout', 'engine_name': 'McAfee', 'engine_update': '20210106', 'engine_version': '6.0.6.653', 'method': 'blacklist', 'result': None}, 'McAfee-GW-Edition': {'category': 'timeout', 'engine_name': 'McAfee-GW-Edition', 'engine_update': '20210105', 'engine_version': None, 'method': 'blacklist', 'result': None}, 'MicroWorld-eScan': {'category': 'undetected', 'engine_name': 'MicroWorld-eScan', 'engine_update': '20210106', 'engine_version': '14.0.409.0', 'method': 'blacklist', 'result': None}, 'Microsoft': {'category': 'undetected', 'engine_name': 'Microsoft', 'engine_update': '20210106', 'engine_version': '1.1.17700.4', 'method': 'blacklist', 'result': None}, 'NANO-Antivirus': {'category': 'timeout', 'engine_name': 'NANO-Antivirus', 'engine_update': '20210106', 'engine_version': '1.0.146.25255', 'method': 'blacklist', 'result': None}, 'Paloalto': {'category': 'undetected', 'engine_name': 'Paloalto', 'engine_update': '20210106', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'Panda': {'category': 'timeout', 'engine_name': 'Panda', 'engine_update': '20210106', 'engine_version': '4.6.4.2', 'method': 'blacklist', 'result': None}, 'Qihoo-360': {'category': 'undetected', 'engine_name': 'Qihoo-360', 'engine_update': '20210106', 'engine_version': '1.0.0.1120', 'method': 'blacklist', 'result': None}, 'Rising': {'category': 'timeout', 'engine_name': 'Rising', 'engine_update': '20210106', 'engine_version': '25.0.0.26', 'method': 'blacklist', 'result': None}, 'SUPERAntiSpyware': {'category': 'undetected', 'engine_name': 'SUPERAntiSpyware', 'engine_update': '20210101', 'engine_version': '5.6.0.1032', 'method': 'blacklist', 'result': None}, 'SentinelOne': {'category': 'undetected', 'engine_name': 'SentinelOne', 'engine_update': '20201222', 'engine_version': '4.7.0.66', 'method': 'blacklist', 'result': None}, 'Sophos': {'category': 'undetected', 'engine_name': 'Sophos', 'engine_update': '20210106', 'engine_version': '1.0.2.0', 'method': 'blacklist', 'result': None}, 'Symantec': {'category': 'undetected', 'engine_name': 'Symantec', 'engine_update': '20210106', 'engine_version': '1.13.0.0', 'method': 'blacklist', 'result': None}, 'SymantecMobileInsight': {'category': 'type-unsupported', 'engine_name': 'SymantecMobileInsight', 'engine_update': '20200813', 'engine_version': '2.0', 'method': 'blacklist', 'result': None}, 'TACHYON': {'category': 'undetected', 'engine_name': 'TACHYON', 'engine_update': '20210106', 'engine_version': '2021-01-06.03', 'method': 'blacklist', 'result': None}, 'Tencent': {'category': 'undetected', 'engine_name': 'Tencent', 'engine_update': '20210106', 'engine_version': '1.0.0.1', 'method': 'blacklist', 'result': None}, 'TotalDefense': {'category': 'undetected', 'engine_name': 'TotalDefense', 'engine_update': '20201217', 'engine_version': '37.1.62.1', 'method': 'blacklist', 'result': None}, 'Trapmine': {'category': 'type-unsupported', 'engine_name': 'Trapmine', 'engine_update': '20200727', 'engine_version': '3.5.0.1023', 'method': 'blacklist', 'result': None}, 'TrendMicro': {'category': 'undetected', 'engine_name': 'TrendMicro', 'engine_update': '20210106', 'engine_version': '11.0.0.1006', 'method': 'blacklist', 'result': None}, 'TrendMicro-HouseCall': {'category': 'undetected', 'engine_name': 'TrendMicro-HouseCall', 'engine_update': '20210106', 'engine_version': '10.0.0.1040', 'method': 'blacklist', 'result': None}, 'Trustlook': {'category': 'type-unsupported', 'engine_name': 'Trustlook', 'engine_update': '20210106', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'VBA32': {'category': 'undetected', 'engine_name': 'VBA32', 'engine_update': '20210106', 'engine_version': '4.4.1', 'method': 'blacklist', 'result': None}, 'VIPRE': {'category': 'undetected', 'engine_name': 'VIPRE', 'engine_update': '20210106', 'engine_version': '89474', 'method': 'blacklist', 'result': None}, 'ViRobot': {'category': 'undetected', 'engine_name': 'ViRobot', 'engine_update': '20210106', 'engine_version': '2014.3.20.0', 'method': 'blacklist', 'result': None}, 'Webroot': {'category': 'failure', 'engine_name': 'Webroot', 'engine_update': '20210106', 'engine_version': '1.0.0.403', 'method': 'blacklist', 'result': None}, 'Yandex': {'category': 'timeout', 'engine_name': 'Yandex', 'engine_update': '20201229', 'engine_version': '5.5.2.24', 'method': 'blacklist', 'result': None}, 'Zillya': {'category': 'undetected', 'engine_name': 'Zillya', 'engine_update': '20210106', 'engine_version': '2.0.0.4263', 'method': 'blacklist', 'result': None}, 'ZoneAlarm': {'category': 'timeout', 'engine_name': 'ZoneAlarm', 'engine_update': '20210106', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'Zoner': {'category': 'undetected', 'engine_name': 'Zoner', 'engine_update': '20210105', 'engine_version': '0.0.0.0', 'method': 'blacklist', 'result': None}}, 'stats': {'confirmed-timeout': 0, 'failure': 2, 'harmless': 0, 'malicious': 0, 'suspicious': 0, 'timeout': 23, 'type-unsupported': 8, 'undetected': 39}, 'status': 'completed'}, 'id': 'Y2IzOTJlYjdmOTllMzhmNzFkNGEzYmE5YWM2ZjI3MDA6MTYwOTk0NjgyNg==', 'type': 'analysis'}, 'meta': {'file_info': {'md5': 'cb392eb7f99e38f71d4a3ba9ac6f2700', 'name': 'C:\\\\Users\\\\IEUser\\\\Downloads\\\\controlled_test\\\\pycharm-community-2020.3.2.exe', 'sha1': '00076d8f9b84a6535a53fc6cee2385d8d2fd80ff', 'sha256': '82196cc453e0868f24a35c580a09c6369b2c5f484a7ef5af5d8a5d1bbcbbc98e', 'size': 365527656}}}
                """
                if analysis['data']['attributes']['stats']['malicious'] >= self.malicious_index:
                    return True
                else:
                    return False
        else:
            with vt.Client(self.vt_api_key) as client:
                with open(full_file_path, 'rb') as f:
                    analysis = client.scan_file(f, wait_for_completion=True)
                    if analysis.to_dict()['attributes']['stats']['malicious'] >= self.malicious_index:
                        return True
                        """
                        analysis.to_dict() output
                        {'type': 'analysis', 'id': 'ZmRkYzM2YzZlYWQ1ZTc3NjE2ZDkxMTk0NDAyM2RkMTU6MTYwOTk0MzA4NA==', 'attributes': {'date': 1609943084, 'results': {'ALYac': {'category': 'failure', 'engine_name': 'ALYac', 'engine_update': '20210106', 'engine_version': '1.1.3.1', 'method': 'blacklist', 'result': None}, 'APEX': {'category': 'type-unsupported', 'engine_name': 'APEX', 'engine_update': '20210105', 'engine_version': '6.117', 'method': 'blacklist', 'result': None}, 'AVG': {'category': 'undetected', 'engine_name': 'AVG', 'engine_update': '20210106', 'engine_version': '21.1.5827.0', 'method': 'blacklist', 'result': None}, 'Acronis': {'category': 'type-unsupported', 'engine_name': 'Acronis', 'engine_update': '20201023', 'engine_version': '1.1.1.80', 'method': 'blacklist', 'result': None}, 'Ad-Aware': {'category': 'undetected', 'engine_name': 'Ad-Aware', 'engine_update': '20210106', 'engine_version': '3.0.16.117', 'method': 'blacklist', 'result': None}, 'AegisLab': {'category': 'undetected', 'engine_name': 'AegisLab', 'engine_update': '20210106', 'engine_version': '4.2', 'method': 'blacklist', 'result': None}, 'AhnLab-V3': {'category': 'undetected', 'engine_name': 'AhnLab-V3', 'engine_update': '20210106', 'engine_version': '3.19.4.10106', 'method': 'blacklist', 'result': None}, 'Alibaba': {'category': 'type-unsupported', 'engine_name': 'Alibaba', 'engine_update': '20190527', 'engine_version': '0.3.0.5', 'method': 'blacklist', 'result': None}, 'Antiy-AVL': {'category': 'undetected', 'engine_name': 'Antiy-AVL', 'engine_update': '20210106', 'engine_version': '3.0.0.1', 'method': 'blacklist', 'result': None}, 'Arcabit': {'category': 'undetected', 'engine_name': 'Arcabit', 'engine_update': '20210106', 'engine_version': '1.0.0.881', 'method': 'blacklist', 'result': None}, 'Avast': {'category': 'undetected', 'engine_name': 'Avast', 'engine_update': '20210106', 'engine_version': '21.1.5827.0', 'method': 'blacklist', 'result': None}, 'Avast-Mobile': {'category': 'type-unsupported', 'engine_name': 'Avast-Mobile', 'engine_update': '20210106', 'engine_version': '210106-00', 'method': 'blacklist', 'result': None}, 'Avira': {'category': 'undetected', 'engine_name': 'Avira', 'engine_update': '20210106', 'engine_version': '8.3.3.10', 'method': 'blacklist', 'result': None}, 'Baidu': {'category': 'undetected', 'engine_name': 'Baidu', 'engine_update': '20190318', 'engine_version': '1.0.0.2', 'method': 'blacklist', 'result': None}, 'BitDefender': {'category': 'undetected', 'engine_name': 'BitDefender', 'engine_update': '20210106', 'engine_version': '7.2', 'method': 'blacklist', 'result': None}, 'BitDefenderFalx': {'category': 'type-unsupported', 'engine_name': 'BitDefenderFalx', 'engine_update': '20200916', 'engine_version': '2.0.936', 'method': 'blacklist', 'result': None}, 'BitDefenderTheta': {'category': 'undetected', 'engine_name': 'BitDefenderTheta', 'engine_update': '20210105', 'engine_version': '7.2.37796.0', 'method': 'blacklist', 'result': None}, 'Bkav': {'category': 'undetected', 'engine_name': 'Bkav', 'engine_update': '20210106', 'engine_version': '1.3.0.9899', 'method': 'blacklist', 'result': None}, 'CAT-QuickHeal': {'category': 'undetected', 'engine_name': 'CAT-QuickHeal', 'engine_update': '20210106', 'engine_version': '14.00', 'method': 'blacklist', 'result': None}, 'CMC': {'category': 'undetected', 'engine_name': 'CMC', 'engine_update': '20201224', 'engine_version': '2.10.2019.1', 'method': 'blacklist', 'result': None}, 'ClamAV': {'category': 'undetected', 'engine_name': 'ClamAV', 'engine_update': '20210106', 'engine_version': '0.102.3.0', 'method': 'blacklist', 'result': None}, 'Comodo': {'category': 'undetected', 'engine_name': 'Comodo', 'engine_update': '20210106', 'engine_version': '33146', 'method': 'blacklist', 'result': None}, 'CrowdStrike': {'category': 'type-unsupported', 'engine_name': 'CrowdStrike', 'engine_update': '20190702', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'Cybereason': {'category': 'type-unsupported', 'engine_name': 'Cybereason', 'engine_update': '20210106', 'engine_version': '1.2.449', 'method': 'blacklist', 'result': None}, 'Cylance': {'category': 'type-unsupported', 'engine_name': 'Cylance', 'engine_update': '20210106', 'engine_version': '2.3.1.101', 'method': 'blacklist', 'result': None}, 'Cynet': {'category': 'undetected', 'engine_name': 'Cynet', 'engine_update': '20210106', 'engine_version': '4.0.0.25', 'method': 'blacklist', 'result': None}, 'Cyren': {'category': 'undetected', 'engine_name': 'Cyren', 'engine_update': '20210106', 'engine_version': '6.3.0.2', 'method': 'blacklist', 'result': None}, 'DrWeb': {'category': 'undetected', 'engine_name': 'DrWeb', 'engine_update': '20210106', 'engine_version': '7.0.49.9080', 'method': 'blacklist', 'result': None}, 'ESET-NOD32': {'category': 'undetected', 'engine_name': 'ESET-NOD32', 'engine_update': '20210106', 'engine_version': '22601', 'method': 'blacklist', 'result': None}, 'Elastic': {'category': 'type-unsupported', 'engine_name': 'Elastic', 'engine_update': '20201214', 'engine_version': '4.0.14', 'method': 'blacklist', 'result': None}, 'Emsisoft': {'category': 'undetected', 'engine_name': 'Emsisoft', 'engine_update': '20210106', 'engine_version': '2018.12.0.1641', 'method': 'blacklist', 'result': None}, 'F-Secure': {'category': 'undetected', 'engine_name': 'F-Secure', 'engine_update': '20210106', 'engine_version': '12.0.86.52', 'method': 'blacklist', 'result': None}, 'FireEye': {'category': 'undetected', 'engine_name': 'FireEye', 'engine_update': '20210106', 'engine_version': '32.36.1.0', 'method': 'blacklist', 'result': None}, 'Fortinet': {'category': 'undetected', 'engine_name': 'Fortinet', 'engine_update': '20210106', 'engine_version': '6.2.142.0', 'method': 'blacklist', 'result': None}, 'GData': {'category': 'undetected', 'engine_name': 'GData', 'engine_update': '20210106', 'engine_version': 'A:25.28272B:27.21493', 'method': 'blacklist', 'result': None}, 'Gridinsoft': {'category': 'undetected', 'engine_name': 'Gridinsoft', 'engine_update': '20210106', 'engine_version': '1.0.23.114', 'method': 'blacklist', 'result': None}, 'Ikarus': {'category': 'undetected', 'engine_name': 'Ikarus', 'engine_update': '20210106', 'engine_version': '0.1.5.2', 'method': 'blacklist', 'result': None}, 'Jiangmin': {'category': 'undetected', 'engine_name': 'Jiangmin', 'engine_update': '20210106', 'engine_version': '16.0.100', 'method': 'blacklist', 'result': None}, 'K7AntiVirus': {'category': 'undetected', 'engine_name': 'K7AntiVirus', 'engine_update': '20210106', 'engine_version': '11.159.36128', 'method': 'blacklist', 'result': None}, 'K7GW': {'category': 'undetected', 'engine_name': 'K7GW', 'engine_update': '20210106', 'engine_version': '11.159.36127', 'method': 'blacklist', 'result': None}, 'Kaspersky': {'category': 'undetected', 'engine_name': 'Kaspersky', 'engine_update': '20210106', 'engine_version': '15.0.1.13', 'method': 'blacklist', 'result': None}, 'Kingsoft': {'category': 'undetected', 'engine_name': 'Kingsoft', 'engine_update': '20210106', 'engine_version': '2017.9.26.565', 'method': 'blacklist', 'result': None}, 'MAX': {'category': 'undetected', 'engine_name': 'MAX', 'engine_update': '20210106', 'engine_version': '2019.9.16.1', 'method': 'blacklist', 'result': None}, 'Malwarebytes': {'category': 'undetected', 'engine_name': 'Malwarebytes', 'engine_update': '20210106', 'engine_version': '3.6.4.335', 'method': 'blacklist', 'result': None}, 'MaxSecure': {'category': 'undetected', 'engine_name': 'MaxSecure', 'engine_update': '20201212', 'engine_version': '1.0.0.1', 'method': 'blacklist', 'result': None}, 'McAfee': {'category': 'undetected', 'engine_name': 'McAfee', 'engine_update': '20210106', 'engine_version': '6.0.6.653', 'method': 'blacklist', 'result': None}, 'McAfee-GW-Edition': {'category': 'undetected', 'engine_name': 'McAfee-GW-Edition', 'engine_update': '20210105', 'engine_version': 'v2019.1.2+3728', 'method': 'blacklist', 'result': None}, 'MicroWorld-eScan': {'category': 'undetected', 'engine_name': 'MicroWorld-eScan', 'engine_update': '20210106', 'engine_version': '14.0.409.0', 'method': 'blacklist', 'result': None}, 'Microsoft': {'category': 'undetected', 'engine_name': 'Microsoft', 'engine_update': '20210106', 'engine_version': '1.1.17700.4', 'method': 'blacklist', 'result': None}, 'NANO-Antivirus': {'category': 'undetected', 'engine_name': 'NANO-Antivirus', 'engine_update': '20210106', 'engine_version': '1.0.146.25255', 'method': 'blacklist', 'result': None}, 'Paloalto': {'category': 'type-unsupported', 'engine_name': 'Paloalto', 'engine_update': '20210106', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'Panda': {'category': 'undetected', 'engine_name': 'Panda', 'engine_update': '20210106', 'engine_version': '4.6.4.2', 'method': 'blacklist', 'result': None}, 'Qihoo-360': {'category': 'undetected', 'engine_name': 'Qihoo-360', 'engine_update': '20210106', 'engine_version': '1.0.0.1120', 'method': 'blacklist', 'result': None}, 'Rising': {'category': 'undetected', 'engine_name': 'Rising', 'engine_update': '20210106', 'engine_version': '25.0.0.26', 'method': 'blacklist', 'result': None}, 'SUPERAntiSpyware': {'category': 'undetected', 'engine_name': 'SUPERAntiSpyware', 'engine_update': '20210101', 'engine_version': '5.6.0.1032', 'method': 'blacklist', 'result': None}, 'Sangfor': {'category': 'undetected', 'engine_name': 'Sangfor', 'engine_update': '20210105', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'SentinelOne': {'category': 'type-unsupported', 'engine_name': 'SentinelOne', 'engine_update': '20201222', 'engine_version': '4.7.0.66', 'method': 'blacklist', 'result': None}, 'Sophos': {'category': 'undetected', 'engine_name': 'Sophos', 'engine_update': '20210106', 'engine_version': '1.0.2.0', 'method': 'blacklist', 'result': None}, 'Symantec': {'category': 'undetected', 'engine_name': 'Symantec', 'engine_update': '20210106', 'engine_version': '1.13.0.0', 'method': 'blacklist', 'result': None}, 'SymantecMobileInsight': {'category': 'type-unsupported', 'engine_name': 'SymantecMobileInsight', 'engine_update': '20200813', 'engine_version': '2.0', 'method': 'blacklist', 'result': None}, 'TACHYON': {'category': 'undetected', 'engine_name': 'TACHYON', 'engine_update': '20210106', 'engine_version': '2021-01-06.03', 'method': 'blacklist', 'result': None}, 'Tencent': {'category': 'undetected', 'engine_name': 'Tencent', 'engine_update': '20210106', 'engine_version': '1.0.0.1', 'method': 'blacklist', 'result': None}, 'TotalDefense': {'category': 'undetected', 'engine_name': 'TotalDefense', 'engine_update': '20201217', 'engine_version': '37.1.62.1', 'method': 'blacklist', 'result': None}, 'Trapmine': {'category': 'type-unsupported', 'engine_name': 'Trapmine', 'engine_update': '20200727', 'engine_version': '3.5.0.1023', 'method': 'blacklist', 'result': None}, 'TrendMicro': {'category': 'undetected', 'engine_name': 'TrendMicro', 'engine_update': '20210106', 'engine_version': '11.0.0.1006', 'method': 'blacklist', 'result': None}, 'TrendMicro-HouseCall': {'category': 'undetected', 'engine_name': 'TrendMicro-HouseCall', 'engine_update': '20210106', 'engine_version': '10.0.0.1040', 'method': 'blacklist', 'result': None}, 'Trustlook': {'category': 'type-unsupported', 'engine_name': 'Trustlook', 'engine_update': '20210106', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'VBA32': {'category': 'undetected', 'engine_name': 'VBA32', 'engine_update': '20210106', 'engine_version': '4.4.1', 'method': 'blacklist', 'result': None}, 'VIPRE': {'category': 'undetected', 'engine_name': 'VIPRE', 'engine_update': '20210106', 'engine_version': '89470', 'method': 'blacklist', 'result': None}, 'ViRobot': {'category': 'undetected', 'engine_name': 'ViRobot', 'engine_update': '20210106', 'engine_version': '2014.3.20.0', 'method': 'blacklist', 'result': None}, 'Webroot': {'category': 'type-unsupported', 'engine_name': 'Webroot', 'engine_update': '20210106', 'engine_version': '1.0.0.403', 'method': 'blacklist', 'result': None}, 'Yandex': {'category': 'undetected', 'engine_name': 'Yandex', 'engine_update': '20201229', 'engine_version': '5.5.2.24', 'method': 'blacklist', 'result': None}, 'Zillya': {'category': 'undetected', 'engine_name': 'Zillya', 'engine_update': '20210106', 'engine_version': '2.0.0.4263', 'method': 'blacklist', 'result': None}, 'ZoneAlarm': {'category': 'undetected', 'engine_name': 'ZoneAlarm', 'engine_update': '20210106', 'engine_version': '1.0', 'method': 'blacklist', 'result': None}, 'Zoner': {'category': 'undetected', 'engine_name': 'Zoner', 'engine_update': '20210105', 'engine_version': '0.0.0.0', 'method': 'blacklist', 'result': None}, 'eGambit': {'category': 'type-unsupported', 'engine_name': 'eGambit', 'engine_update': '20210106', 'engine_version': None, 'method': 'blacklist', 'result': None}}, 'stats': {'confirmed-timeout': 0, 'failure': 1, 'harmless': 0, 'malicious': 0, 'suspicious': 0, 'timeout': 0, 'type-unsupported': 16, 'undetected': 59}, 'status': 'completed'}}
                        """
                    else:
                        return False

    # def av_scan(self, directory=None, mal_detected=0, files_scanned=0, scanned_list=[]):
    def av_scan(self, selected_directory=None):
        mal_detected = 0
        files_scanned = 0
        scanned_list = []
        no_malware = True

        if selected_directory == None:
            directory = self.directory
        else:
            directory = selected_directory
        print(directory)
        exes = self.get_exe_files(directory)
        for exe in exes:
            try:
                print("Scanning ", exe)
                if self.vt_file_exist(exe):
                    self.mal_file(exe)
                    scanned_list.append({"FilePath": exe, "malicious": True})
                else:
                    if self.vt_upload_file(exe):
                        self.mal_file(exe)
                        scanned_list.append({"FilePath": exe, "malicious": True})
                malicious_items = [] # store malicious file path
                for item in scanned_list:
                    malicious_items.append(item["FilePath"])
                if exe not in malicious_items: # append non malicious file path
                    scanned_list.append({"FilePath": exe, "malicious": False})
            except:
                print("failed to scan: ", exe)
                continue
        files_scanned += len(scanned_list)
        for item in scanned_list:
            if item['malicious']:
                no_malware = False
                break
        if no_malware:
            string = "Scanned " + self.directory + "\n" + self.directory + " Drive is safe"
            self.toaster.show_toast("Anti Virus scan", string, icon_path="../static/media/cultisk.ico", duration=3)
        else:
            for item in scanned_list:
                if item["malicious"]:
                    mal_detected += 1
                    string = "Scanned " + self.directory + "\n" + item['FilePath'] + " malicious file in " + self.directory + " Drive deleted"
                    self.toaster.show_toast("Anti Virus scan", string, icon_path="../static/media/cultisk.ico", duration=3)
        last_scan_time = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        result = {
            'mal_detected': mal_detected,
            'files_scanned': files_scanned,
            'scanned_list': scanned_list,
            'last_scanned_time': last_scan_time
        }
        print(f"> {result}")

        # file = open('result.txt', 'w')
        # file.write(json.dumps(result) + '\n')
        # file.close()

        return json.dumps(result)

    def av_filescan(self, file_path):
        try:
            print("Scanning ", file_path)
            if self.vt_file_exist(file_path):
                self.mal_file(file_path)
                string = "Scanned " + file_path + "\n" + file_path + " has been deleted"
                self.toaster.show_toast("Anti Virus scan", string, icon_path="../static/media/cultisk.ico", duration=3)
            else:
                if self.vt_upload_file(file_path):
                    self.mal_file(file_path)
                    string = "Scanned " + file_path + "\n" + file_path + " has been deleted"
                    self.toaster.show_toast("Anti Virus scan", string, icon_path="../static/media/cultisk.ico", duration=3)
        except:
            print("failed to scan: ", file_path)
        return

    # test_func
    def test_scan(self, directory=None):
        result = {
            'mal_detected': 1,
            'files_scanned': 130,
            'scanned_list': [{"FilePath": 'D:\\malware', "malicious": True}, {"FilePath": 'C:\\not_malware', "malicious": False}],
            'last_scanned_time': '10/02/2021 06:50:25'
        }
        print(f"> {result}")
        return json.dumps(result)

    def Get_deleted_file(self):
        file = open('result.txt', 'r')
        result = []
        filelines = file.read().splitlines()
        for line in reversed(filelines):
            filepath, timing = line.split(',')
            result.append({'FilePath': filepath, "timing": timing})
        print(json.dumps(result))
        file.close()
        return json.dumps(result)

