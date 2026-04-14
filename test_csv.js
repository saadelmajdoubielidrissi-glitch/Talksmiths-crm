const fs = require('fs');
const csvText = fs.readFileSync('Talksmiths_Prospects_1000_Companies.csv', 'utf8');

function parseCSV(csvText) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  // Split manually to handle quotes properly
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === '\n' && !inQuotes) {
      lines.push(currentLine);
      currentLine = '';
      continue;
    }
    currentLine += char;
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const row = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    
    results.push(row);
  }

  return results;
}

function parseCSVLine(line) {
  const values = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  values.push(currentValue);
  return values.map(val => val.replace(/^"|"$/g, '').trim()); // Strip wrapping quotes
}

const parsed = parseCSV(csvText);
console.log("Total parsed rows:", parsed.length);
if (parsed.length > 0) {
    console.log("First row Name:", parsed[0].Name);
    console.log("Keys of first row:", Object.keys(parsed[0]));
}
