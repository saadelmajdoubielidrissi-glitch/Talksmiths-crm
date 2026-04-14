import urllib.request
import urllib.parse
import re
import json

companies = [
    "Valeo Morocco",
    "Johnson & Johnson Morocco",
    "Ubisoft Morocco",
    "Amazon Morocco",
    "Thales Morocco",
    "Continental Morocco",
    "Zettabyte Labs Casablanca",
    "Change.org Morocco",
    "T-Systems Morocco",
    "Broadcom Morocco"
]

results = []
for comp in companies:
    query = f'{comp} official website'
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 '}
    )
    try:
        response = urllib.request.urlopen(req, timeout=5)
        html = response.read().decode('utf-8')
        
        links = re.findall(r'<a class="result__url" href="(.*?)">', html)
        if links:
            # Filter social media and directories
            valid_links = [l for l in links if not any(x in l for x in ['linkedin.com', 'facebook.com', 'twitter.com', 'youtube.com', 'glassdoor.com', 'indeed.com', 'zoominfo.com', 'apollo.io'])]
            if valid_links:
                results.append({"company": comp, "url": valid_links[0]})
            else:
                results.append({"company": comp, "url": links[0]})
        else:
            results.append({"company": comp, "url": "Not found"})
    except Exception as e:
        results.append({"company": comp, "url": f"Error: {e}"})

print(json.dumps(results, indent=2))
