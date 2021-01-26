# https://github.com/getlinksc/scrape_google/blob/master/search.py
import requests
from bs4 import BeautifulSoup
import re

# desktop user-agent
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"


def Google_Search(query):
    query = query.replace(' ', '+')
    URL = f"https://google.com/search?q={query}"

    headers = {"user-agent": USER_AGENT}
    resp = requests.get(URL, headers=headers)

    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        results = []
        for g in soup.find_all('div', class_='g'):
            # anchor div
            rc = g.find('div', class_='rc')
            # description div
            s = g.find('div', class_='s')
            if rc:
                divs = rc.find_all('div', recursive=False)
                if len(divs) >= 2:
                    anchor = divs[0].find('a')
                    link = anchor['href']
                    title = anchor.find('h3').text
                    item = {
                        "title": title,
                        "link": link
                    }
                    results.append(item)
        return results[0]


def Version_Info_Lookup(link):
    headers = {"user-agent": USER_AGENT}
    resp = requests.get(link, headers=headers)
    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        version = soup.find_all(string=re.compile(r"(Version|version)\s*([0-9]+.[0-9]*.*)"))
        if version:
            return version
        else:
            return "undefined"
