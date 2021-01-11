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
  [Docker for Windows](https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe),
  [Git](https://git-scm.com/downloads)
* Under Visual Studio Build Tools found at Visual Studio Installer, install Visual C++ build tools, VC++ 2015.3 v14.00 (v140) toolset for desktop, MFC & ATL
* Run Command Prompt as administrator and navigate to the project root folder
* Create and activate a python venv
  * Run `python -m venv venv` to create a venv
  * Run `"venv/Scripts/activate.bat"` to activate the venv
* Install required packages/modules for development purposes
  * Run `npm install git+https://github.com/willy00/zerorpc-node.git` to install zeroRPC
  * Run `npm install` in the project root folder to install necessary packages
  * Run `pip install -r requirements.txt` 
  * **NOTE:** To update `requirements.txt` after installing a new package, run the following command `pip freeze > requirements.txt`

* Run the Python ZeroRPC server by running the following commands:
  * `docker build -t cultisk-dev . && docker run -d -t -p 4242:4242 cultisk-dev `
  
* Run the Electron application by running the following commands
  * `npm start`
