import csv
import time
import re
import urllib.request
import urllib.parse

input_filename = "Talksmiths_Ranked_Outreach_Schedule.csv"
output_filename = "Talksmiths_Week1_With_URLs.csv"

def is_valid_url(url):
    invalid_domains = [
        "linkedin.com", "facebook.com", "instagram.com", "twitter.com", 
        "youtube.com", "glassdoor.com", "indeed.com", "zoominfo.com", 
        "bloomberg.com", "wikipedia.org", "ma.kompass.com", "dnb.com",
        "wuzzuf.net", "bayt.com", "rekrute.com", "crunchbase.com", "pitchbook.com",
        "apollo.io", "rocketreach.co", "foursquare.com", "yellowpages",
        "duckduckgo.com" # avoid internal ddg links
    ]
    for domain in invalid_domains:
        if domain in url:
            return False
    return True

def search_ddg(query):
    try:
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        response = urllib.request.urlopen(req, timeout=5)
        html = response.read().decode('utf-8')
        
        # Extract URLs
        urls = re.findall(r'class="result__url" href="([^"]+)"', html)
        if not urls:
            urls = re.findall(r'<a class="result__url" href="([^"]+)">', html)
            
        for u in urls:
            if u.startswith('//'):
                u = "https:" + u
            # Duckduckgo redirects links to duckduckgo.com/l/?uddg=
            if 'uddg=' in u:
                import urllib.parse as uparse
                parsed = uparse.parse_qs(uparse.urlparse(u).query)
                if 'uddg' in parsed:
                    u = parsed['uddg'][0]
            
            if is_valid_url(u) and u.startswith("http"):
                return u
    except Exception as e:
        print(f"  Error on ddg search: {e}")
    return "URL_NOT_FOUND"

week1_prospects = []

with open(input_filename, "r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if row and row[-1] == "Week 1":
            week1_prospects.append(row)

if "Website_URL" not in header:
    header.append("Website_URL")

print(f"Found {len(week1_prospects)} targets for Week 1. Beginning URL search via DuckDuckGo...")

with open(output_filename, "w", encoding="utf-8-sig", newline="") as f_out:
    writer = csv.writer(f_out)
    writer.writerow(header)
    
    for idx, row in enumerate(week1_prospects):
        name = row[1]
        query = f'{name} company official website Morocco'
        print(f"[{idx+1}/{len(week1_prospects)}] Searching for: {name}")
        
        website = search_ddg(query)
        print(f"  Found: {website}")
        
        # Ensure row is correct length
        while len(row) < len(header) - 1:
            row.append("")
        
        if len(row) < len(header):
            row.append(website)
        else:
            row[-1] = website
            
        writer.writerow(row)
        f_out.flush()
        
        time.sleep(2.0)

print(f"Done! Saved to {output_filename}")
