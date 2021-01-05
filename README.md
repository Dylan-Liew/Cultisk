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
  [OpenSSL v1.0.2](https://web.archive.org/web/20200427093430/https://slproweb.com/download/Win64OpenSSL-1_0_2u.exe) and 
  [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16)
* Under Visual Studio Build Tools found at Visual Studio Installer, install Visual C++ build tools, VC++ 2015.3 v14.00 (v140) toolset for desktop, MFC & ATL
* Run Command Prompt as administrator and navigate to the project root folder
* Create and activate a python venv
  * Run `python -m venv venv` to create a venv
  * Run `"venv/Scripts/activate.bat"` to activate the venv
* Install required packages/modules
  * Run `npm install git+https://github.com/willy00/zerorpc-node.git` to install zeroRPC
  * Run `npm install` in the project root folder to install neccessary packages
  * Run `pip install -r requirements.txt` 
  * **NOTE:** To update `requirements.txt` after installing a new package, run the following command `pip freeze > requirements.txt`
* Run the application by running the following commands
  * `npm start`
  * `py main.py`
