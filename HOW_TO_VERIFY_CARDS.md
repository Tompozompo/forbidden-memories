# How to Verify and Fix Card Database

## Summary of Issues Found

The card database currently has **34 cards that need replacement**:
- **32 duplicate card names** (same cards appearing at multiple IDs)
- **1 incorrect card type** (ID 155 "Fissure" is a Spell, not a Monster)
- **1 additional duplicate from the triplicate** (Beaver Warrior appears 3 times)

After removing duplicates, we have **688 unique cards** instead of 722, meaning **34 cards are missing**.

## Files Created for Verification

1. **VERIFICATION_REPORT.md** - Detailed analysis of all issues found
2. **CARDS_TO_REPLACE.txt** - Simple list of the 34 card IDs that need correction
3. **CARD_VERIFICATION.csv** - Spreadsheet with all 722 cards for manual verification
4. **CARD_VERIFICATION.html** - Visual browser-based comparison tool

## How to Fix the Card Database

### Option 1: Manual Verification (Recommended)

1. **Get the Official Card List**
   - Visit: https://yugioh.fandom.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_cards
   - Copy the card list or save the page

2. **Open CARD_VERIFICATION.csv**
   - Open in Excel, Google Sheets, or any spreadsheet program
   - Cards marked "NEEDS REPLACEMENT" are the ones to fix
   
3. **Compare and Correct**
   - For each "NEEDS REPLACEMENT" card, look up the correct card at that ID number
   - Update the Name, ATK, DEF, Type, Attribute, Race, and Level columns
   - Save the corrected CSV file

4. **Import Corrections**
   ```bash
   cd scripts
   python3 import_corrections.py ../CARD_VERIFICATION_CORRECTED.csv
   ```

### Option 2: Visual Comparison

1. Open **CARD_VERIFICATION.html** in your web browser
2. Open the wiki page side-by-side
3. Red cards = Need replacement
4. Blue cards = Already verified
5. Green cards = OK but not yet verified

### Option 3: Automated Wiki Data Import

If you can access the wiki and copy the card table:

1. **Copy the wiki table data**
   - Visit: https://yugioh.fandom.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_cards
   - Copy the entire card table (tab-separated format)
   - Save to a text file (e.g., `wiki_cards.txt`)

2. **Run the parser**
   ```bash
   cd scripts
   python3 parse_wiki_data.py wiki_cards.txt
   ```

3. **Verify the changes**
   ```bash
   npm run build
   npm run dev
   ```

The parser expects tab-separated data in this format:
```
ID  Name  Type  Race  Level  ATK  DEF  Password  Cost
001 Blue-eyes White Dragon  Monster Dragon  8 3000  2500  89631139  999,999
```

## List of Cards Needing Replacement

The following IDs currently have duplicates or errors:

**Monster Cards (IDs 1-656):**
- 151, 152, 155, 159, 160, 161, 162, 164, 165, 166
- 183, 184, 202, 207, 224, 231, 241, 243, 254, 264
- 270, 274, 282, 283, 286, 300

**Spell Cards (IDs 657-686):**
- 669, 682, 683, 684, 685, 686

**Trap Cards (IDs 687-722):**
- 720, 721

## What We Know Is Correct

- **Cards 1-150**: Verified accurate (per documentation)
- **Card count**: 722 total is correct (656 monsters + 30 spells + 36 traps)
- **Card structure**: All cards have proper JSON structure

## Technical Details

### Duplicate Cards Found

| Card Name | Original ID | Duplicate ID(s) |
|-----------|-------------|-----------------|
| Beaver Warrior | 27 | 254, 264 |
| Krokodilus | 76 | 151 |
| Toad Master | 101 | 152 |
| Mystic Horseman | 91 | 159 |
| Rabid Horseman | 92 | 160 |
| Zanki | 93 | 161 |
| Crawling Dragon | 94 | 162 |
| Armored Lizard | 51 | 164 |
| Firegrass | 129 | 165 |
| Man-Eating Plant | 75 | 166 |
| Flame Cerebrus | 112 | 183 |
| Mushroom Man | 8 | 184 |
| Swamp Battleguard | 12 | 202 |
| Catapult Turtle | 89 | 207 |
| Dancing Elf | 104 | 224 |
| Fireyarou | 106 | 231 |
| Octoberser | 109 | 241 |
| Charubin the Fire Knight | 170 | 243 |
| Maha Vailo | 103 | 270 |
| Oscillo Hero #2 | 45 | 274 |
| Psychic Kappa | 119 | 282 |
| Masaki the Legendary Swordsman | 120 | 283 |
| Lord of the Lamp | 140 | 286 |
| Megazowler | 79 | 300 |
| Tremendous Fire | 532 | 669 |
| Dark Magician Girl | 649 | 682 |
| Sword of Dark Destruction | 445 | 683 |
| Black Pendant | 443 | 684 |
| Invigoration | 430 | 685 |
| Follow Wind | 433 | 686 |
| Dragon Treasure | 435 | 720 |
| Malevolent Nuzzler | 441 | 721 |

## After Fixing

Once you've provided the correct card data:
1. The import script will update `src/data/cards.json`
2. A backup will be created automatically
3. Run `npm run build` to verify no TypeScript errors
4. Test the app to ensure everything works
5. Commit the changes

## Questions?

If you need help or have questions about the verification process, please ask!
