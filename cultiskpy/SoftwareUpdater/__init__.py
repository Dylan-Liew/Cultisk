import json
import winreg
import re
from .web_scraper import Google_Search, Version_Info_Lookup
from multiprocessing.pool import ThreadPool as Pool
from win10toast import ToastNotifier

# Filter Variables
filter_publishers = ["NVIDIA Corporation", "Microsoft Corporation", "Microsoft",
                     "Acer", "Acer Incorporated", "Realtek Semiconductor Corp.",
                     "Microsoft Corporations", "Intel Corporation", "Intel",
                     "Intel(R) Corporation", "Realtek", "Python Software Foundation",
                     "CPUID, Inc.", "https://golang.org", "ESET, spol. s r.o."]

filter_words = ["Service", "Connector", "Update", "Python",
                "Refresh Manager", "Installer", "Run Time",
                "Database", "Driver", "SDK", "ODBC", "Support",
                "Notifier", "Examples", "Documents", "Windows",
                "Options"]


def filter_software(software):
    # Filter by Publisher
    if software['publisher'] in filter_publishers:
        return False
    # Filter by Keywords
    for word in filter_words:
        if word.lower() in software['name']:
            return False
    return software


def clean_name(name):
    # Lowercase
    cleaned_name = name.lower()
    # Remove digits
    cleaned_name = ''.join([i for i in cleaned_name if not i.isdigit()])
    # Remove dots
    cleaned_name = cleaned_name.replace('.', '')
    # Remove "bit" "-"
    cleaned_name = cleaned_name.replace('bit', ' ')
    cleaned_name = cleaned_name.replace('-', ' ')
    cleaned_name = cleaned_name.replace('  ', ' ')
    # Remove text in brackets
    cleaned_name = re.sub(r'\(.*?\)', "", cleaned_name)
    # Remove leading and trailing whitespaces.
    cleaned_name = cleaned_name.strip()
    return cleaned_name


def get_software_list(hive, flag):
    # Establishes a connection to a predefined registry handle
    reg = winreg.ConnectRegistry(None, hive)
    # Opens the specified key
    key = winreg.OpenKey(reg, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                          0, winreg.KEY_READ | flag)
    # The number of sub keys this key has
    subkey_count = winreg.QueryInfoKey(key)[0]
    software_list = []

    for i in range(subkey_count):
        software = {}
        try:
            # Subkey Name
            subkey_name = winreg.EnumKey(key, i)
            if "Steam App" not in subkey_name:
                # Open Subkey
                subkey = winreg.OpenKey(key, subkey_name)
                software['name'] = clean_name(winreg.QueryValueEx(subkey, "DisplayName")[0])
                try:
                    software['version'] = winreg.QueryValueEx(subkey, "DisplayVersion")[0]
                except EnvironmentError:
                    software['version'] = 'undefined'
                try:
                    software['publisher'] = winreg.QueryValueEx(subkey, "Publisher")[0]
                except EnvironmentError:
                    software['publisher'] = 'undefined'
                if filter_software(software):
                    software_list.append(software)
        except EnvironmentError:
            continue
    return software_list


# winreg.KEY_WOW64_64KEY
# Indicates that an application on 64-bit Windows should operate on the 64-bit registry view.
# winreg.KEY_WOW64_32KEY
# Indicates that an application on 64-bit Windows should operate on the 32-bit registry view.
# winreg.HKEY_CURRENT_USER
# the preferences of the current user

# software_list = get_software_list(winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_32KEY) + \
#                 get_software_list(winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_64KEY) + \
#                 get_software_list(winreg.HKEY_CURRENT_USER, 0)

class Logic:
    def get_software(self):
        print("< <Software Updater> Get User software")
        output = {
            "data": get_software_list(winreg.HKEY_CURRENT_USER, 0),
            "success": True
        }
        print(f"> {output}")
        return json.dumps(output)
