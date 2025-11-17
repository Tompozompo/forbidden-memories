#!/usr/bin/env python3
"""
Import corrected card data from CSV
Usage: python3 import_corrections.py <corrected_cards.csv>
"""
import json
import csv
import sys
from pathlib import Path

def import_corrections(csv_file):
    """Import corrections from CSV"""
    cards_file = Path('/home/runner/work/forbidden-memories/forbidden-memories/src/data/cards.json')
    
    # Load current cards
    with open(cards_file, 'r') as f:
        cards = json.load(f)
    
    # Create a dict for easy lookup
    cards_dict = {card['id']: card for card in cards}
    
    # Read corrections from CSV
    corrections = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get('Status') == 'NEEDS REPLACEMENT':
                card_id = int(row['ID'])
                corrections.append({
                    'id': card_id,
                    'name': row['Name'],
                    'atk': int(row['ATK']) if row['ATK'] and row['ATK'] != '' else None,
                    'def': int(row['DEF']) if row['DEF'] and row['DEF'] != '' else None,
                    'type': row['Type'],
                    'attr': row.get('Attribute', ''),
                    'race': row.get('Race', ''),
                    'level': int(row['Level']) if row.get('Level') and row['Level'] != '' else None
                })
    
    # Apply corrections
    for correction in corrections:
        card_id = correction['id']
        if card_id in cards_dict:
            # Update the card
            for key, value in correction.items():
                if value:  # Only update if value is not empty
                    cards_dict[card_id][key] = value
            print(f"✓ Updated card ID {card_id}: {correction['name']}")
    
    # Save back to file
    cards_list = [cards_dict[i] for i in sorted(cards_dict.keys())]
    
    # Backup original
    backup_file = cards_file.with_suffix('.json.backup')
    with open(backup_file, 'w') as f:
        json.dump(cards, f, indent=2)
    print(f"\n✓ Created backup: {backup_file}")
    
    # Save corrected version
    with open(cards_file, 'w') as f:
        json.dump(cards_list, f, indent=2)
    print(f"✓ Saved corrected cards to: {cards_file}")
    print(f"\nTotal corrections applied: {len(corrections)}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 import_corrections.py <corrected_cards.csv>")
        sys.exit(1)
    
    import_corrections(sys.argv[1])
