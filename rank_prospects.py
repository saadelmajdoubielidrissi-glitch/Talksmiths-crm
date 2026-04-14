import csv

input_file = "Talksmiths_Prospects_1000_Companies.csv"
output_file = "Talksmiths_Ranked_Outreach_Schedule.csv"

def score_prospect(row):
    sector = row[2].lower()
    international = row[5].lower()
    english = row[6].lower()
    
    score = 0
    
    # Sector Scoring (max 30)
    high_priority_sectors = ['bpo', 'cx', 'it services', 'tech', 'software', 'cloud', 'fintech', 'cfc', 'investment banking', 'vc', 'cybersecurity', 'startup', 'saas', 'ai ']
    mid_priority_sectors = ['telecom', 'automotive', 'aerospace', 'pharma', 'logistics', 'e-commerce']
    
    if any(keyword in sector for keyword in high_priority_sectors):
        score += 30
    elif any(keyword in sector for keyword in mid_priority_sectors):
        score += 20
    else:
        score += 10
        
    # English Requirement Scoring (max 40)
    if 'very high' in english or 'english-only' in english:
        score += 40
    elif 'medium-high' in englioutreach preparation phase — ranking, scoring, and building outreach sequences.sh:
        score += 20
    elif 'high' in english:
        score += 30
    else:
        score += 10
        
    # International Presence Scoring (max 30)
    if 'global' in international or 'us' in international or 'uk' in international or 'worldwide' in international:
        score += 30
    elif 'europe' in international or 'eu' in international or 'africa' in international:
        score += 20
    else:
        score += 10
        
    return score

# Read and Score
prospects = []
with open(input_file, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if not row: continue
        score = score_prospect(row)
        prospects.append(row + [score])

# Sort prospects by score (descending)
prospects.sort(key=lambda x: x[-1], reverse=True)

# Assign weeks (100 per week) and output
header.extend(['Score', 'Outreach_Week'])

with open(output_file, 'w', encoding='utf-8-sig', newline='') as f_out:
    writer = csv.writer(f_out)
    writer.writerow(header)
    for i, prospect in enumerate(prospects):
        week = (i // 100) + 1
        # Cap to week 10 just in case
        if week > 10:
            week = 10
        prospect.append(f"Week {week}")
        # write row
        writer.writerow(prospect)

print(f"Scoring complete. Top prospect score: {prospects[0][-2]}")
print(f"File saved to {output_file}")
