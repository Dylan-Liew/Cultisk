d# Cultisk Data Security Toolkit

## NYP DSF1901 Year 2 Semester 2 Group Project

### Description

A Data Security Toolkit Electron desktop application.
Majority of the business logic is done with Python.
UI is done using VueJS, a javascript UI framework.
Communication between Electron App and Python backend is achieved using a JSON-RPC, Client/Server model

### Group:

* [Dylan](https://github.com/Dylan-Liew)
* [Joel](https://github.com/j041)
* [William](https://github.com/willy00)
* [Kent](https://github.com/kentlow2002)
* [Cassandra](https://github.com/Cassandra-Fu)

### Technologies:
* Python > 3.8
* Electron ~ 11.0.0
* NodeJS 14
* VueJS ~ 2
* Vuex ~ 2
* Vue-router ~ 2

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
| (Vue Components)   |               | (business logic) |
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
Recommended IDEs: 
Pycharm Professional (30 days trial available [here](https://www.jetbrains.com/pycharm/download/#section=windows)) 
/ Visual Studio Code

* Install [NodeJS](https://nodejs.org/en/download/), 
  [Python](https://www.python.org/downloads/), 
  [Git](https://git-scm.com/downloads)
    
* Install required packages for Electron App
  * Run `npm install` in the project root folder to install necessary packages
  
* Install required modules for Cultisk Py
  * Run `pip install -r requirements.txt`
  
* Run the application by running the following commands in the order as stated and different terminal
  * `py cultiskpy\main.py` under cultiskpy directory
  * `npm run electron:serve`
