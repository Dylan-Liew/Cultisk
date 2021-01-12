# Cultisk Data Security Toolkit

## NYP DSF1901 Year 2 Semester 2 Group Project

### Description

A Data Security Toolkit Electron desktop application.
Backend is done using Python. 
Communication between Electron App and Python backend is achieved using a JSON-RPC, Client/Server model

### Group:

* [Dylan](https://github.com/Dylan-Liew)
* [Joel](https://github.com/j041)
* [William](https://github.com/willy00)
* [Kent](https://github.com/kentlow2002)
* [Cassandra](https://github.com/Cassandra-Fu)

### Technologies:
* Python > 3.7
* Electron 7.3
* NodeJS 12.18.4
* OpenSSL 1.0.2u

### Application Architecture

```text
start
 | 
 V 
+--------------------+
|                    | start
|  electron          +-------------> +------------------+
|                    | sub process   |                  |
| (browser)          |               | python server    |
|                    |               |                  |
| (all html/css/js)  |               | (business logic) |
|                    |   zerorpc     |                  |
| (node.js runtime,  | <-----------> | (zeromq server)  |
|  zeromq client)    | communication |                  |
|                    |               |                  |
+--------------------+               +------------------+
```

### Project Structure

```text
.
|-- cultiskpy (Python code, includes individual features and Logic for the RPC server)
    |-- PasswordManager 
        |-- __init__.py 
        |-- *.db 
    |-- BackupManager
        ....
    |-- EmailFilter
        ....
    |-- AntiVirus
        ....
    |-- VulnScanner 
        ....
    ....
    |-- main.py
|-- src 
    |-- pw_manager 
        .... (HTML/CSS/TS)
    |-- backup_manager
        .... (HTML/CSS/TS)
    |-- email_filter
        .... (HTML/CSS/TS)
    |-- anti_virus
        .... (HTML/CSS/TS)
    |-- vuln_scanner
        .... (HTML/CSS/TS)
    |-- types (Typescript types declaration)
    |-- app.ts (Main process TS file)
    |-- index.css (Main Renderer css)
    |-- index_render.ts (Main Renderer TS file)
|-- dist (compiled JS code is here)
|-- .eslintrc.json (ESlint config)
|-- package.json (NodeJS config)
|-- tsconfig.json (TS config)
`-- README.md
```

### Developer Environment Setup
Recommended IDEs: Pycharm / Visual Studio Code  
This guide assumes you are using Bit 64 version of Windows.

* Install [NodeJS](https://nodejs.org/en/download/), 
  [Python](https://www.python.org/downloads/), 
  [OpenSSL v1.0.2](https://web.archive.org/web/20200427093430/https://slproweb.com/download/Win64OpenSSL-1_0_2u.exe), 
  [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16),
  [Tcl Windows](https://www.activestate.com/products/activetcl/downloads/) and
  [Git](https://git-scm.com/downloads)
  
* Under Visual Studio Build Tools 2019 found at Visual Studio Installer, install C++ Build Tools with the following options shown below, 
![C++ Build Tools](https://i.imgur.com/6t5rr36.png)
* Create,activate and configure python venv
  * Run `python -m venv venv` to create a python venv
  * Run `"venv/Scripts/activate.bat"` to activate the venv
  * Run `pip install -r requirements.txt` 
  * **NOTE:** To update `requirements.txt` after installing a new package, run the following command `pip freeze > requirements.txt`
  * Building and installing pysqlcipher3
    * Run `git clone https://github.com/sqlcipher/sqlcipher.git` to clone the repository to the current working directory
    * Download the sqlcipher DLL [here](https://1drv.ms/u/s!AtgS340NL-Ukh58UFgmOuQKEEs2P-A?e=pgAjE3)
    * Move the DLL to Python's DLL folder
      `C:\Users\<username>\AppData\Local\Programs\Python\<Python version>\DLLs`
    * **NOTE:** If it doesn't work, move the DLL to System32
    * Search for **x64 Native Tools Command Prompt for VS 2019** and open it
    * Navigate to your current working directory 
    * Navigate to the sqlcipher directory with `cd sqlcipher` 
    * Run `nmake /f Makefile.msc`
    * **NOTE:** The build attempt will fail, it is normal.
    * Navigate to the previous directory with `cd ..` 
    * Run `git clone https://github.com/rigglemania/pysqlcipher3.git` to clone the repository to the current working directory
    * Navigate to the pysqlcipher3 directory with `cd pysqlcipher3` 
    * Create **amalgamation** directory with `mkdir amalgamation`
    * Copy both **sqlite3.h** and **sqlite3.c** from sqlcipher to amalgamation with `copy ../sqlcipher/sqlite3.h amalgamation` and `copy ../sqlcipher/sqlite3.c amalgamation`
    * Navigate to amalgamation directory with `cd amalgamation`
    * Create **sqlcipher** directory with `mkdir sqlcipher`
    * Copy both **sqlite3.h** and **sqlite3.c** from ../sqlcipher to sqlcipher with `copy ../../sqlcipher/sqlite3.h sqlcipher` and `copy ../../sqlcipher/sqlite3.c sqlcipher`
    * Navigate to the pysqlcipher3 directory with `cd ../../`
    * Run `python setup.py build_amalgamation`
    * Run `python setup.py install`
    
* Install required packages/modules
  * Run `npm install git+https://github.com/willy00/zerorpc-node.git` to install zeroRPC
  * Run `npm install` in the project root folder to install necessary packages
  
* Run the application by running the following commands
  * **NOTE:** Must follow the order in different terminal
  * `py main.py` under cultiskpy directory
  * `npm start`
