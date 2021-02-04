import requests
from bs4 import BeautifulSoup
import re

filter_words = ["Driver", "Processor"]

# desktop user-agent
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"


def Filehippo_Search(query):
    query = query.replace(' ', '+')
    URL = f"https://filehippo.com/search/?q={query}"

    headers = {"user-agent": USER_AGENT}
    resp = requests.get(URL, headers=headers)
    results = []
    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        for software in soup.findAll('a', class_="card-program"):
            link = software.get('href')
            title = software.get('title')
            results.append({"title": title, "link": link})
        for software in results:
            if query in software["title"].lower() or software["title"].lower() in query:
                for word in filter_words:
                    if word.lower() in software["title"].lower():
                        return {"title": "undefined", "link": "undefined"}
                return software
        return {"title": "undefined", "link": "undefined"}


def Version_Info_Lookup(link):
    if link != "undefined":
        headers = {"user-agent": USER_AGENT}
        resp = requests.get(link, headers=headers)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.content, "html.parser")
            version = soup.find('p', class_="program-header__version").getText()
            download = soup.find('a', class_="program-button--download").get("href")
            if version:
                return version, download
            else:
                return "undefined", "undefined"
    else:
        return "undefined", "undefined"


