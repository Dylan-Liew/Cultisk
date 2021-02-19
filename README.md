# Cultisk Data Security Toolkit

## NYP DSF1901 Year 2 Semester 2 Group Project

### Description

A Data Security Toolkit Electron desktop application.
Majority of the business logic is done with Python.
UI is done using VueJS, a javascript UI framework.
Communication between Electron App and Python backend is achieved using a JSON-RPC, Client/Server model, API done with Python Flask Restx

### Group:

* [Dylan](https://github.com/Dylan-Liew)
* [Joel](https://github.com/j041)
* [William](https://github.com/willy00)
* [Kent](https://github.com/kentlow2002)
* [Cassandra](https://github.com/Cassandra-Fu)

### Technologies:
* Python > 3.8
* Flask Restx 
* Electron ~ 11.0.0
* VueJS ~ 2

### Developer Environment Setup
Recommended IDEs: 
Pycharm Professional (30 days trial available [here](https://www.jetbrains.com/pycharm/download/#section=windows)) 
/ Visual Studio Code

* Install [NodeJS](https://nodejs.org/en/download/), 
  [Python](https://www.python.org/downloads/), 
  [Git](https://git-scm.com/downloads),
  [Wireshark](https://www.wireshark.org/download.html),
  [Visual Studio](https://visualstudio.microsoft.com/downloads/)
    
* Install required packages for Electron App
  * Run `npm install` in the project root folder to install necessary packages
  
* Install required modules for Cultisk Py
  * Run `pip install -r requirements.txt`
  
* Run the application by running the following commands in the order as stated and different terminal
  * `py cultiskpy\main.py` under cultiskpy directory
  * `npm run electron:serve`
 
 ### VirusTotal API key Setup
 * Sign up for a virustotal account (https://www.virustotal.com/gui/join-us)
 * Set the API key as an environment variable
   * VT_API_KEY=api_key
