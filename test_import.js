const fs = require('fs');

function parseCSVLine(line, delimiter = ',') {
  const values = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  values.push(currentValue);
  return values.map(val => val.replace(/^"|"$/g, '').trim()); // Strip wrapping quotes
}

function parseCSV(csvText) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  // Split manually to handle quotes properly
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && i + 1 < csvText.length && csvText[i + 1] === '\n') {
        i++; // skip the \n in \r\n
      }
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

  // Auto-detect delimiter from the first line
  const delimiter = lines[0].includes(';') && !lines[0].includes(',') ? ';' : ',';

  const headers = parseCSVLine(lines[0], delimiter);
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line, delimiter);
    const row = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    
    results.push(row);
  }

  return results;
}

const text = fs.readFileSync('Talksmiths_Prospects_1000_Companies.csv', 'utf8');
const parsed = parseCSV(text);

const newLeads = [];
parsed.forEach(row => {
  const companyName = row.Name || row.Company || row['Company Name'];
  if (!companyName) {
      console.log('Skipped a row: ', row);
      return; 
  }
  
  newLeads.push({
    companyName: companyName,
    sector: row.Sector || '',
  });
});

console.log("Parsed total:", parsed.length);
console.log("Leads generated:", newLeads.length);
if (parsed.length > 0) {
    console.log("Headers:", Object.keys(parsed[0]));
}

