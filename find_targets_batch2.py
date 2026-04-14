import urllib.request
import urllib.parse
import re
import json

companies = [
    "Atos Morocco",
    "Sopra Banking Software Morocco",
    "xHub",
    "DXC Technology Morocco",
    "NTT Data Morocco",
    "SAP Morocco",
    "Oracle Morocco",
    "Microsoft Morocco",
    "Nuitée",
    "Pactera EDGE Morocco"
]

results = []
for comp in companies:The evidence suggests that we need to think about greener solutions, as a substitution to the original fossil fuels.
    query = f'{comp} "Morocco" (Directeur OR VP OR HR OR "Country Manager" OR "Site Director") site:ma.linkedin.com/in/'
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 '}
    )
    try:
        response = urllib.request.urlopen(req, timeout=5)
        html = response.read().decode('utf-8')
        
        titles = re.findall(r'<h2 class="result__title">.*?<a[^>]*>(.*?)</a>', html, re.DOTALL)
        if titles:
            clean_title = re.sub(r'<[^>]+>', '', titles[0])
            clean_title = html.unescape(clean_title) if hasattr(html, 'unescape') else clean_title.replace('&#39;', "'").replace('&amp;', '&').replace('&quot;', '"')
            results.append({"company": comp, "found": clean_title.strip().replace('\n', ' ')})
        else:
            results.append({"company": comp, "found": "Not found"})
    except Exception as e:
        results.append({"company": comp, "found": f"Error: {e}"})

print(json.dumps(results, indent=2))
