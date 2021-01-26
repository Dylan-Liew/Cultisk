"""
source: https://medium.com/python-in-plain-english/digital-forensics-accessing-the-windows-registry-with-python-f32e138691b0
"""
import winreg

from winreg import (
  ConnectRegistry,
  OpenKey,
  KEY_ALL_ACCESS,
  EnumValue,
  QueryInfoKey,
  HKEY_LOCAL_MACHINE,
  HKEY_CURRENT_USER
)

"""
HKEY_CURRENT_USERSoftwareMicrosoftWindowsCurrentVersionRun
HKEY_CURRENT_USERSoftwareMicrosoftWindowsCurrentVersionRunOnce

HKEY_LOCAL_MACHINESOFTWAREMicrosoftWindowsCurrentVersionRun
HKEY_LOCAL_MACHINESOFTWAREMicrosoftWindowsCurrentVersionRunOnce
HKEY_LOCAL_MACHINESoftwareMicrosoftWindowsCurrentVersionPoliciesExplorerRun
"""
"""
def get_hive_content(hive, flag):
    # Establishes a connection to a predefined registry handle
    aReg = winreg.ConnectRegistry(None, hive)
    # Opens the specified key
    aKey = winreg.OpenKey(aReg, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_READ | flag)
    # The number of sub keys this key has
    count_subkey = winreg.QueryInfoKey(aKey)[0]
    print(count_subkey)

    software_list = []

    for i in range(count_subkey):
        software = {}
        try:
            # Subkey Name
            asubkey_name = winreg.EnumKey(aKey, i)
            print("name: ", asubkey_name)
            # Open Subkey
            asubkey = winreg.OpenKey(aKey, asubkey_name)
            print("subkey", asubkey)
            # software['name'] = winreg.QueryValueEx(asubkey, "DisplayName")[0]
            # try:
            #     software['version'] = winreg.QueryValueEx(asubkey, "DisplayVersion")[0]
            # except EnvironmentError:
            #     software['version'] = 'undefined'
            # try:
            #     software['publisher'] = winreg.QueryValueEx(asubkey, "Publisher")[0]
            # except EnvironmentError:
            #     software['publisher'] = 'undefined'
        except EnvironmentError:
            continue
    return software_list

get_hive_content(winreg.HKEY_CURRENT_USER, 0)
"""

# filter_publishers = ["Intel"]
# filter_words = ["Windows"]
#
#
# def filter_software(software):
#     for word in filter_words:
#         if word in software['name']:
#             return False
#     if software['publisher'] not in filter_publishers:
#         return software
#     else:
#         return False

# def get_software_list(hive, flag):
#     # Establishes a connection to a predefined registry handle
#     aReg = winreg.ConnectRegistry(None, hive)
#     # Opens the specified key
#     aKey = winreg.OpenKey(aReg, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
#                           0, winreg.KEY_READ | flag)
#     # The number of sub keys this key has
#     count_subkey = winreg.QueryInfoKey(aKey)[0]
#     software_list = []
#
#     for i in range(count_subkey):
#         software = {}
#         try:
#             # Subkey Name
#             asubkey_name = winreg.EnumKey(aKey, i)
#             # Open Subkey
#             asubkey = winreg.OpenKey(aKey, asubkey_name)
#             software['name'] = winreg.QueryValueEx(asubkey, "DisplayName")[0]
#             try:
#                 software['version'] = winreg.QueryValueEx(asubkey, "DisplayVersion")[0]
#             except EnvironmentError:
#                 software['version'] = 'undefined'
#             try:
#                 software['publisher'] = winreg.QueryValueEx(asubkey, "Publisher")[0]
#             except EnvironmentError:
#                 software['publisher'] = 'undefined'
#             if filter_software(software):
#                 software_list.append(software)
#         except EnvironmentError:
#             continue
#     return software_list


# winreg.KEY_WOW64_64KEY
# Indicates that an application on 64-bit Windows should operate on the 64-bit registry view.
# winreg.KEY_WOW64_32KEY
# Indicates that an application on 64-bit Windows should operate on the 32-bit registry view.
# winreg.HKEY_CURRENT_USER
# the preferences of the current user

# software_list = get_software_list(winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_32KEY) + \
#                 get_software_list(winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_64KEY) + \
#                 get_software_list(winreg.HKEY_CURRENT_USER, 0)

# for software in software_list:
#     print('Name=%s, Version=%s, Publisher=%s' % (software['name'], software['version'], software['publisher']))
# print('Number of installed apps: %s' % len(software_list))

# def get_hive_content(hive):
#     software_list = []
#     reg_key = winreg.OpenKey(hive, "Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_READ)
#     subkey = winreg.QueryInfoKey(reg_key)
#     print(subkey[0])
#     for i in range(20):
#         try:
#             # Subkey Name
#             subkey_name = winreg.EnumKey(reg_key, i)
#             # Open Subkey
#             asubkey = winreg.OpenKey(reg_key, subkey_name)
#             print("subkey", asubkey)
#         except:
#             print("ERR")
#             continue


# get_hive_content(winreg.HKEY_CURRENT_USER)

def enum_key(hive, subkey:str):
    with OpenKey(hive, subkey, 0, KEY_ALL_ACCESS) as key:
        num_of_values = QueryInfoKey(key)[1]
        for i in range(num_of_values):
            values = EnumValue(key, i)
            if values[0] == "LangID": continue
            print(*values[:-1], sep="\t")

if __name__ == "__main__":
    # Connecting to the HKEY_CURRENT_USER hive
    with ConnectRegistry(None, HKEY_CURRENT_USER) as hkcu_hive:
        print("\nPreviously Ran Applications")
        print("-"*50)
        # enum_key(hkcu_hive, r"SOFTWARE\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache")
        enum_key(hkcu_hive, r"Software\Microsoft\Windows\CurrentVersion\Run")
