"""

source: https://abdus.dev/posts/python-monitor-usb/

"""

import re
import subprocess
import threading
from time import sleep
from typing import Callable


def get_drives() -> dict:
    output = subprocess.getoutput('wmic logicaldisk get name,volumename')
    drives = {}
    for line in output.splitlines()[1:]:
        if not line.strip():
            continue
        try:
            letter, label = re.split(r'\s+', line.strip(), 1)
        except:
            letter, label = line, ''
        drives[letter.strip(':')] = label
    return drives


def watch_drives(on_change: Callable[[dict], None] = print, poll_interval: int = 1):
    def _watcher():
        prev = None
        while True:
            drives = get_drives()
            if prev != drives:
                on_change(drives)
                prev = drives
                test_func(1, 2, 3)
                return prev
            sleep(poll_interval)

    t = threading.Thread(target=_watcher)
    t.start()
    t.join()


def test_func(a, b, c):
    print(a, b, c)


if __name__ == '__main__':
    watch_drives(on_change=print)
