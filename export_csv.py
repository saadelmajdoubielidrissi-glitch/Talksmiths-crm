import os
import csv
import re

md_files = [
    "BATCH-1-COMPANIES-001-200.md",
    "BATCH-2-COMPANIES-201-400.md",
    "BATCH-3-COMPANIES-401-600.md",
    "BATCH-4-COMPANIES-601-800.md",
    "BATCH-5-COMPANIES-801-1000.md"
]

output_file = "Talksmiths_Prospects_1000_Companies.csv"

def process_files():
    # Use utf-8-sig so Excel recognizes utf-8 characters properly
    with open(output_file, 'w', encoding='utf-8-sig', newline='') as f_out:
        writer = csv.writer(f_out)
        writer.writerow(["ID", "Name", "Sector", "City", "Funding Stage", "International Presence", "English Requirement"])
        
        for md_file in md_files:
            if not os.path.exists(md_file):
                print(f"Warning: {md_file} not found.")
                continue
                
            print(f"Processing {md_file}...")
            with open(md_file, 'r', encoding='utf-8') as f_in:
                lines = f_in.readlines()
                in_table = False
                for line in lines:
                    line = line.strip()
                    
                    # Detect start of the summary table, indicating the end of company data in the file
                    if line.startswith('| Sector | Count |'):
                        in_table = False
                        continue
                        
                    # Detect start of our company tables
                    if line.startswith('| # | Name |'):
                        in_table = True
                        continue
                        
                    if line.startswith('|---|'):
                        continue
                        
                    # If we are inside the companies table and line looks like a valid markdown table row
                    if in_table and line.startswith('|') and line.endswith('|'):
                        parts = [p.strip() for p in line.split('|')[1:-1]]
                        # Only add if it looks like a valid numbering row to avoid any random lines
                        if len(parts) >= 7 and parts[0].isdigit():
                            writer.writerow(parts)
                            
    print(f"Successfully generated {output_file}")

if __name__ == "__main__":
    process_files()
