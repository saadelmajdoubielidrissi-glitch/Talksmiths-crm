import urllib.request
import urllib.parse
import re
import json

targets = [
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
for target in targets:
    query = f'{target} Morocco (Directeur OR VP OR HR OR "Country Manager" OR "Site Director") site:linkedin.com/in/'
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 '}
    )
    try:
        response = urllib.request.urlopen(req, timeout=5)
        html = response.read().decode('utf-8')
        
        # Extract name and title from search results
        regex = r'<h2 class="result__title">.*?<a[^>]*>(.*?)</a>'
        matches = re.findall(regex, html, re.DOTALL)
        if matches:
            clean_text = re.sub(r'<[^>]+>', '', matches[0]).strip()
            results.append({"target": target, "found": clean_text})
        else:
            results.append({"target": target, "found": "Not found"})
    except Exception as e:
        results.append({"target": target, "found": f"Error: {e}"})

print(json.dumps(results, indent=2))
