import winreg
import re
from .web_scraper import Filehippo_Search, Version_Info_Lookup
from multiprocessing.pool import ThreadPool as Pool

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
                "Options", "Microsoft", "Driver"]


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
    cleaned_name = re.sub("\(.*?\)", "", cleaned_name)
    # Remove leading and trailing whitespaces.
    cleaned_name = cleaned_name.strip()
    return cleaned_name


def get_software_list(hive, flag):
    # Establishes a connection to a predefined registry handle
    aReg = winreg.ConnectRegistry(None, hive)
    # Opens the specified key
    aKey = winreg.OpenKey(aReg, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                          0, winreg.KEY_READ | flag)
    # The number of sub keys this key has
    count_subkey = winreg.QueryInfoKey(aKey)[0]
    software_list = []

    for i in range(count_subkey):
        software = {}
        try:
            # Subkey Name
            asubkey_name = winreg.EnumKey(aKey, i)
            if "Steam App" not in asubkey_name:
                # Open Subkey
                asubkey = winreg.OpenKey(aKey, asubkey_name)
                software['name'] = clean_name(winreg.QueryValueEx(asubkey, "DisplayName")[0])
                try:
                    software['version'] = winreg.QueryValueEx(asubkey, "DisplayVersion")[0]
                except EnvironmentError:
                    software['version'] = 'undefined'
                try:
                    software['publisher'] = winreg.QueryValueEx(asubkey, "Publisher")[0]
                except EnvironmentError:
                    software['publisher'] = 'undefined'
                if filter_software(software):
                    software_list.append(software)
        except EnvironmentError:
            continue
    return software_list


# Search for download link using MultiProcessing
def worker(software):
    result = Filehippo_Search(software['name'])
    if result:
        software["title"] = result["title"]
        software["link"] = result["link"]
        software['lat_version'], software['download_link'] = Version_Info_Lookup(result["link"])


def software_update_scan():
    # software_list = get_software_list(winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_32KEY) + \
    #                 get_software_list(winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_64KEY) + \
    #                 get_software_list(winreg.HKEY_CURRENT_USER, 0)
    software_list = get_software_list(winreg.HKEY_CURRENT_USER, 0)
    pool_size = 3
    pool = Pool(pool_size)
    for software in software_list:
        pool.apply_async(worker, (software,))
    pool.close()
    pool.join()
    return software_list


