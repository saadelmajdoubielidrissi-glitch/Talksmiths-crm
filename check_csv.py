import csv

try:
    with open('Talksmiths_Prospects_1000_Companies.csv', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        print("Headers:", headers)
        count = 0
        for row in reader:
            count += 1
            if len(row) != len(headers):
                print(f"Row {count} has different number of columns: {len(row)}")
        print("Total valid rows:", count)
except Exception as e:
    print("Error:", e)
