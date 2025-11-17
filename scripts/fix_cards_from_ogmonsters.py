#!/usr/bin/env python3
"""
Fix duplicate/incorrect cards using the ogmonsters file as source of truth
"""
import json
import re
from pathlib import Path

def parse_ogmonsters_line(line):
    """Parse a line from ogmonsters file"""
    parts = line.strip().split('\t')
    
    if len(parts) < 3:
        return None
    
    try:
        card_id = int(parts[0])
        name = parts[1]
        card_type = parts[2]
        
        card = {
            'id': card_id,
            'name': name,
            'type': card_type
        }
        
        # For monsters, add race, level, atk, def
        if card_type == "Monster" and len(parts) >= 7:
            race = parts[3] if parts[3] else ""
            level_str = parts[4] if parts[4] else ""
            atk_str = parts[5] if parts[5] else ""
            def_str = parts[6] if parts[6] else ""
            
            if race:
                card['race'] = race
            
            if level_str.isdigit():
                card['level'] = int(level_str)
            
            if atk_str.replace(',', '').isdigit():
                card['atk'] = int(atk_str.replace(',', ''))
            
            if def_str.replace(',', '').isdigit():
                card['def'] = int(def_str.replace(',', ''))
        
        # For Ritual cards (which are spells)
        if card_type == "Ritual":
            card['type'] = "Spell"
        
        # For Magic cards (which are spells)
        if card_type == "Magic":
            card['type'] = "Spell"
        
        return card
    except (ValueError, IndexError) as e:
        print(f"Warning: Could not parse line: {line[:50]}... Error: {e}")
        return None

def load_ogmonsters(filepath):
    """Load all cards from ogmonsters file"""
    cards = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            card = parse_ogmonsters_line(line)
            if card:
                cards[card['id']] = card
    return cards

def update_cards_json(ogmonsters_cards, cards_file):
    """Update cards.json with data from ogmonsters"""
    # Load current cards
    with open(cards_file, 'r', encoding='utf-8') as f:
        current_cards = json.load(f)
    
    # Create backup
    backup_file = str(cards_file).replace('.json', '.backup.json')
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(current_cards, f, indent=2)
    print(f"✓ Created backup: {backup_file}")
    
    # Update cards
    current_dict = {c['id']: c for c in current_cards}
    
    updates = 0
    for card_id, og_card in ogmonsters_cards.items():
        if card_id in current_dict:
            current = current_dict[card_id]
            
            # Check if any fields need updating
            changed = False
            for key, value in og_card.items():
                if key == 'id':
                    continue
                if current.get(key) != value:
                    current[key] = value
                    changed = True
            
            # Remove fields that shouldn't be there for non-monsters
            if og_card['type'] in ['Spell', 'Trap']:
                for field in ['atk', 'def', 'race', 'level']:
                    if field in current:
                        del current[field]
                        changed = True
            
            if changed:
                updates += 1
                print(f"  Updated card {card_id:03d}: {og_card['name']}")
    
    # Save updated cards
    cards_list = [current_dict[i] for i in sorted(current_dict.keys())]
    
    with open(cards_file, 'w', encoding='utf-8') as f:
        json.dump(cards_list, f, indent=2)
    
    print(f"\n✓ Updated {updates} cards")
    print(f"✓ Saved to: {cards_file}")
    
    return updates

def main():
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    
    ogmonsters_file = repo_root / 'ogmonsters'
    cards_file = repo_root / 'src' / 'data' / 'cards.json'
    
    print("=" * 80)
    print("Fixing Cards Database from ogmonsters")
    print("=" * 80)
    print()
    
    # Load ogmonsters
    print("Loading ogmonsters file...")
    og_cards = load_ogmonsters(ogmonsters_file)
    print(f"✓ Loaded {len(og_cards)} cards from ogmonsters")
    print()
    
    # Update cards.json
    print("Updating cards.json...")
    updates = update_cards_json(og_cards, cards_file)
    
    print()
    print("=" * 80)
    print(f"✓ Complete! Fixed {updates} cards")
    print("=" * 80)

if __name__ == '__main__':
    main()
