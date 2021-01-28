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
