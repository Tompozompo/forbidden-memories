# Card Verification - Quick Start Guide

## 🎯 What You Need to Know

Your card database has **34 duplicates/errors** that need fixing.

## 🚀 Quick Fix (30 minutes)

### Step 1: Open the Spreadsheet
```bash
# Open CARD_VERIFICATION.csv in Excel or Google Sheets
```

### Step 2: Open the Wiki
Visit: https://yugioh.fandom.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_cards

### Step 3: Fix the 34 Cards
- Look for rows marked **"NEEDS REPLACEMENT"** (34 total)
- For each one, look up the correct card at that ID number on the wiki
- Fill in: Name, ATK, DEF, Type, Attribute, Race, Level
- Save your edited CSV

### Step 4: Import the Fixes
```bash
cd /path/to/forbidden-memories
python3 scripts/import_corrections.py CARD_VERIFICATION.csv
```

### Step 5: Test
```bash
npm run build
npm run dev
```

## 📋 The 34 Cards to Fix

### Monsters (26 cards)
IDs: 151, 152, 155, 159, 160, 161, 162, 164, 165, 166, 183, 184, 202, 207, 224, 231, 241, 243, 254, 264, 270, 274, 282, 283, 286, 300

### Spells/Traps (8 cards)  
IDs: 669, 682, 683, 684, 685, 686, 720, 721

## 📊 Example

Current (WRONG):
```
ID 151: Krokodilus (duplicate of ID 76)
```

Should be (from wiki):
```
ID 151: <Look up what card #151 actually is>
```

## 🛠️ Alternative: Give Me Wiki Data

Can't do manual work? Provide me with:
- Saved HTML of the wiki page, OR
- Copy-pasted card list, OR  
- Screenshot/PDF of the card table

And I can parse it automatically!

## ❓ Questions?

See **HOW_TO_VERIFY_CARDS.md** for detailed instructions.
