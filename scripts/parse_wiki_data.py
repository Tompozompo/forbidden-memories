#!/usr/bin/env python3
"""
Parse Yu-Gi-Oh! Forbidden Memories wiki data and update cards.json
This script reads tab-separated wiki data and updates the card database
"""
import json
import sys
import re
from pathlib import Path

def parse_wiki_line(line):
    """Parse a single line of wiki data"""
    # Expected format: ID\tName\tType\tRace\tLevel\tATK\tDEF\tPassword\tCost
    parts = [p.strip() for p in line.split('\t')]
    
    if len(parts) < 7:
        return None
    
    try:
        card_id = int(parts[0])
        name = parts[1]
        card_type = parts[2]  # "Monster", "Spell", or "Trap"
        race = parts[3] if len(parts) > 3 else ""
        level = int(parts[4]) if len(parts) > 4 and parts[4].isdigit() else None
        atk = int(parts[5]) if len(parts) > 5 and parts[5].replace(',', '').isdigit() else None
        def_val = int(parts[6]) if len(parts) > 6 and parts[6].replace(',', '').isdigit() else None
        
        card = {
            'id': card_id,
            'name': name,
            'type': card_type
        }
        
        # Add monster-specific fields
        if card_type == "Monster":
            if atk is not None:
                card['atk'] = atk
            if def_val is not None:
                card['def'] = def_val
            if race:
                card['race'] = race
            if level is not None:
                card['level'] = level
        
        return card
    except (ValueError, IndexError) as e:
        print(f"Warning: Could not parse line: {line[:50]}... Error: {e}")
        return None

def parse_wiki_data(wiki_text):
    """Parse complete wiki data from text"""
    lines = wiki_text.strip().split('\n')
    cards = []
    
    for line in lines:
        # Skip empty lines, headers, or truncated data
        if not line.strip() or line.startswith('#') or '...' in line:
            continue
        
        card = parse_wiki_line(line)
        if card:
            cards.append(card)
    
    return cards

def update_cards_json(wiki_cards, cards_file='../src/data/cards.json'):
    """Update cards.json with wiki data"""
    cards_path = Path(__file__).parent / cards_file
    
    # Load current cards
    with open(cards_path, 'r') as f:
        current_cards = json.load(f)
    
    # Create a lookup dict
    current_dict = {c['id']: c for c in current_cards}
    wiki_dict = {c['id']: c for c in wiki_cards}
    
    # Update cards from wiki
    updates = 0
    for card_id, wiki_card in wiki_dict.items():
        if card_id in current_dict:
            # Preserve any fields not in wiki data
            current = current_dict[card_id]
            for key, value in wiki_card.items():
                if current.get(key) != value:
                    current[key] = value
                    updates += 1
    
    # Save updated cards
    cards_list = [current_dict[i] for i in sorted(current_dict.keys())]
    
    # Backup
    backup_path = cards_path.with_suffix('.json.backup')
    with open(backup_path, 'w') as f:
        json.dump(current_cards, f, indent=2)
    
    with open(cards_path, 'w') as f:
        json.dump(cards_list, f, indent=2)
    
    print(f"✓ Updated {updates} card fields")
    print(f"✓ Backup saved to {backup_path}")
    print(f"✓ Cards saved to {cards_path}")
    
    return updates

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 parse_wiki_data.py <wiki_data.txt>")
        print("\nExpected format (tab-separated):")
        print("ID  Name  Type  Race  Level  ATK  DEF  Password  Cost")
        sys.exit(1)
    
    wiki_file = sys.argv[1]
    
    # Read wiki data
    with open(wiki_file, 'r') as f:
        wiki_text = f.read()
    
    # Parse wiki data
    wiki_cards = parse_wiki_data(wiki_text)
    print(f"Parsed {len(wiki_cards)} cards from wiki data")
    
    if not wiki_cards:
        print("Error: No cards parsed. Check the format of your wiki data.")
        sys.exit(1)
    
    # Show sample
    print("\nSample cards:")
    for card in wiki_cards[:5]:
        print(f"  {card['id']:03d}: {card['name']}")
    
    # Update cards.json
    updates = update_cards_json(wiki_cards)
    
    print(f"\n✓ Complete! Updated {updates} card fields.")

if __name__ == '__main__':
    main()
