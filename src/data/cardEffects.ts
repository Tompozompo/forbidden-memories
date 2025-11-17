// Card effects database for Spell/Trap cards
// This defines what each spell/trap card does

export type EffectType = 
  | 'equip_atk'      // Equip spell that boosts ATK
  | 'equip_def'      // Equip spell that boosts DEF
  | 'equip_both'     // Equip spell that boosts both ATK and DEF
  | 'direct_damage'  // Direct damage to opponent
  | 'heal'          // Heal life points
  | 'destroy_monster' // Destroy monster(s)
  | 'destroy_all'   // Destroy all monsters
  | 'draw'          // Draw cards
  | 'field'         // Field spell effect
  | 'ritual'        // Ritual summon
  | 'trap_destroy'  // Trap that destroys
  | 'trap_damage'   // Trap that deals damage
  | 'trap_negate'   // Trap that negates
  | 'utility';      // Other utility effects

export interface CardEffect {
  cardId: number;
  type: EffectType;
  description: string;
  // Effect parameters
  value?: number;        // For damage/heal/boost amounts
  targetType?: 'self' | 'opponent' | 'all' | 'monster' | 'monsters';
  condition?: string;    // Activation condition (for traps)
  duration?: number;     // Effect duration in turns (0 = permanent)
}

// Card effects database - based on Yu-Gi-Oh! Forbidden Memories
export const CARD_EFFECTS: Record<number, CardEffect> = {
  // Equip Spells - ATK Boosters
  301: { cardId: 301, type: 'equip_atk', description: 'Equip only to a Warrior-Type monster. It gains 300 ATK.', value: 300 },
  302: { cardId: 302, type: 'equip_atk', description: 'Equip only to a DARK monster. It gains 400 ATK.', value: 400 },
  303: { cardId: 303, type: 'equip_atk', description: 'Equip only to a Fiend-Type monster. It gains 300 ATK.', value: 300 },
  304: { cardId: 304, type: 'equip_atk', description: 'The equipped monster gains 1000 ATK.', value: 1000 },
  305: { cardId: 305, type: 'equip_atk', description: 'Equip only to an Insect-Type monster. It gains 700 ATK.', value: 700 },
  306: { cardId: 306, type: 'equip_atk', description: 'Equip only to an Insect-Type monster. It gains 700 ATK.', value: 700 },
  307: { cardId: 307, type: 'equip_atk', description: 'Equip only to a Spellcaster-Type monster. It gains 400 ATK.', value: 400 },
  308: { cardId: 308, type: 'equip_atk', description: 'Equip only to a Beast-Type monster. It gains 300 ATK.', value: 300 },
  311: { cardId: 311, type: 'equip_atk', description: 'The equipped monster gains 500 ATK.', value: 500 },
  312: { cardId: 312, type: 'equip_atk', description: 'Equip only to a Fairy-Type monster. It gains 300 ATK.', value: 300 },
  313: { cardId: 313, type: 'equip_atk', description: 'Equip only to a Beast-Warrior-Type monster. It gains 400 ATK.', value: 400 },
  314: { cardId: 314, type: 'equip_atk', description: 'The equipped monster gains 700 ATK.', value: 700 },
  315: { cardId: 315, type: 'equip_atk', description: 'Equip only to a Dragon-Type monster. It gains 300 ATK.', value: 300 },
  316: { cardId: 316, type: 'equip_atk', description: 'Equip only to a Thunder-Type monster. It gains 300 ATK.', value: 300 },
  321: { cardId: 321, type: 'equip_atk', description: 'The equipped monster gains 700 ATK.', value: 700 },
  322: { cardId: 322, type: 'equip_atk', description: 'Equip only to a Zombie-Type monster. It gains 300 ATK.', value: 300 },
  323: { cardId: 323, type: 'equip_atk', description: 'Equip only to a Spellcaster-Type monster. It gains 300 ATK.', value: 300 },
  324: { cardId: 324, type: 'equip_atk', description: 'Equip only to a Warrior-Type monster. It gains 400 ATK.', value: 400 },
  326: { cardId: 326, type: 'equip_atk', description: 'Equip only to a Dinosaur-Type monster. It gains 400 ATK.', value: 400 },
  327: { cardId: 327, type: 'equip_atk', description: 'Equip only to a Winged Beast-Type monster. It gains 300 ATK.', value: 300 },
  328: { cardId: 328, type: 'equip_atk', description: 'Equip only to an Aqua-Type or Fish-Type monster. It gains 300 ATK.', value: 300 },
  654: { cardId: 654, type: 'equip_atk', description: 'Equip only to a Pyro-Type monster. It gains 700 ATK.', value: 700 },
  657: { cardId: 657, type: 'equip_atk', description: 'If your LP is lower than your opponent\'s, the equipped monster gains 1000 ATK. If higher, it loses 1000 ATK.', value: 1000 },
  658: { cardId: 658, type: 'equip_atk', description: 'The equipped monster gains ATK equal to half the original ATK of the monster it battles.', value: 500 },
  659: { cardId: 659, type: 'equip_atk', description: 'Equip only to a Winged Beast-Type monster. It gains 500 ATK.', value: 500 },

  // Equip Spells - DEF Boosters
  309: { cardId: 309, type: 'equip_def', description: 'Equip only to an Aqua-Type monster. It gains 300 DEF.', value: 300 },
  317: { cardId: 317, type: 'equip_def', description: 'Equip only to a Machine-Type monster. It gains 500 DEF.', value: 500 },
  
  // Equip Spells - Special
  318: { cardId: 318, type: 'utility', description: 'Special Summon any number of "Harpie Lady" or "Harpie Lady Sisters" from your hand.', targetType: 'self' },
  319: { cardId: 319, type: 'equip_atk', description: 'Equip only to a Beast-Warrior-Type monster. It gains 300 ATK.', value: 300 },
  325: { cardId: 325, type: 'utility', description: 'Change all Machine-Type monsters on the field to Machine-Type.', targetType: 'all' },
  651: { cardId: 651, type: 'equip_atk', description: 'The equipped monster gains 500 ATK.', value: 500 },
  652: { cardId: 652, type: 'equip_def', description: 'The equipped monster gains 300 DEF.', value: 300 },
  668: { cardId: 668, type: 'equip_atk', description: 'Equip only to a Warrior-Type monster. It gains 400 ATK.', value: 400 },

  // Direct Damage Magic Cards
  343: { cardId: 343, type: 'direct_damage', description: 'Inflict 200 damage to your opponent.', value: 200, targetType: 'opponent' },
  344: { cardId: 344, type: 'direct_damage', description: 'Inflict 500 damage to your opponent.', value: 500, targetType: 'opponent' },
  345: { cardId: 345, type: 'direct_damage', description: 'Inflict 600 damage to your opponent.', value: 600, targetType: 'opponent' },
  346: { cardId: 346, type: 'direct_damage', description: 'Inflict 800 damage to your opponent.', value: 800, targetType: 'opponent' },
  347: { cardId: 347, type: 'direct_damage', description: 'Inflict 1000 damage to each player.', value: 1000, targetType: 'all' },

  // Healing Magic Cards
  339: { cardId: 339, type: 'heal', description: 'Increase your Life Points by 500.', value: 500, targetType: 'self' },
  340: { cardId: 340, type: 'heal', description: 'Increase your Life Points by 600.', value: 600, targetType: 'self' },
  341: { cardId: 341, type: 'heal', description: 'Increase your Life Points by 800.', value: 800, targetType: 'self' },
  342: { cardId: 342, type: 'heal', description: 'Increase your Life Points by 1000.', value: 1000, targetType: 'self' },

  // Destruction Magic Cards
  336: { cardId: 336, type: 'destroy_all', description: 'Destroy all monsters on the field.', targetType: 'all' },
  337: { cardId: 337, type: 'destroy_all', description: 'Destroy all monsters your opponent controls.', targetType: 'opponent' },
  653: { cardId: 653, type: 'destroy_monster', description: 'Destroy all Warrior-Type monsters on the field.', targetType: 'all' },
  656: { cardId: 656, type: 'destroy_monster', description: 'Destroy all Zombie-Type and Fiend-Type monsters on the field.', targetType: 'all' },
  672: { cardId: 672, type: 'destroy_all', description: 'Destroy all Spell and Trap Cards your opponent controls.', targetType: 'opponent' },

  // Utility Magic Cards
  320: { cardId: 320, type: 'utility', description: 'All face-up Defense Position monsters on the field are switched to Attack Position.', targetType: 'all' },
  329: { cardId: 329, type: 'utility', description: 'Change all Dragon-Type monsters on the field to Attack Position.', targetType: 'all' },
  338: { cardId: 338, type: 'utility', description: 'Draw 1 card.', targetType: 'self' },
  348: { cardId: 348, type: 'utility', description: 'Your opponent cannot declare an attack for 3 turns.', targetType: 'opponent', duration: 3 },
  349: { cardId: 349, type: 'utility', description: 'Select 1 monster on your opponent\'s side of the field and it cannot attack or change its battle position.', targetType: 'opponent', duration: 0 },
  350: { cardId: 350, type: 'utility', description: 'Flip all face-down monsters on the field face-up.', targetType: 'all' },
  655: { cardId: 655, type: 'utility', description: 'Remove all Spell Cards from the field.', targetType: 'all' },
  660: { cardId: 660, type: 'destroy_monster', description: 'Destroy 1 monster on the field.', targetType: 'monster' },
  661: { cardId: 661, type: 'destroy_all', description: 'Destroy all monsters with 1500 or more ATK on the field.', targetType: 'all' },
  662: { cardId: 662, type: 'destroy_monster', description: 'Destroy 1 Insect-Type monster.', targetType: 'monster' },
  663: { cardId: 663, type: 'utility', description: 'All DARK monsters on the field lose 500 ATK.', targetType: 'all', value: -500 },
  664: { cardId: 664, type: 'utility', description: 'All Aqua-Type monsters on the field gain 500 ATK and DEF.', targetType: 'all', value: 500 },
  669: { cardId: 669, type: 'utility', description: 'Select 1 monster on the field. It cannot attack or change its battle position.', targetType: 'monster' },

  // Trap Cards
  681: { cardId: 681, type: 'trap_destroy', description: 'When your opponent summons a monster, destroy it.', targetType: 'monster', condition: 'summon' },
  682: { cardId: 682, type: 'trap_destroy', description: 'When your opponent attacks, destroy the attacking monster.', targetType: 'monster', condition: 'attack' },
  683: { cardId: 683, type: 'trap_destroy', description: 'When your opponent attacks with a monster, destroy it.', targetType: 'monster', condition: 'attack' },
  684: { cardId: 684, type: 'trap_destroy', description: 'When your opponent summons a monster, destroy it.', targetType: 'monster', condition: 'summon' },
  685: { cardId: 685, type: 'trap_destroy', description: 'When your opponent summons a monster, destroy it.', targetType: 'monster', condition: 'summon' },
  686: { cardId: 686, type: 'trap_destroy', description: 'Destroy 1 monster your opponent controls.', targetType: 'monster', condition: 'any' },
  687: { cardId: 687, type: 'trap_negate', description: 'Negate the attack of 1 monster.', targetType: 'monster', condition: 'attack' },
  688: { cardId: 688, type: 'trap_damage', description: 'When your opponent would gain Life Points, they take that amount as damage instead.', targetType: 'opponent', condition: 'heal' },
  689: { cardId: 689, type: 'trap_negate', description: 'Negate the effects of all Spell Cards on the field until your next turn.', targetType: 'all', condition: 'any' },
  690: { cardId: 690, type: 'utility', description: 'This card does nothing. It is a fake trap.', targetType: 'self' },

  // Field Spell Cards
  330: { cardId: 330, type: 'field', description: 'All Insect, Beast, Plant, and Beast-Warrior monsters gain 200 ATK and DEF.', value: 200, targetType: 'all' },
  331: { cardId: 331, type: 'field', description: 'All Dinosaur, Zombie, and Rock monsters gain 200 ATK and DEF.', value: 200, targetType: 'all' },
  332: { cardId: 332, type: 'field', description: 'All Dragon, Winged Beast, and Thunder monsters gain 200 ATK and DEF.', value: 200, targetType: 'all' },
  334: { cardId: 334, type: 'field', description: 'All Fish, Sea Serpent, Thunder, and Aqua monsters gain 200 ATK and DEF.', value: 200, targetType: 'all' },
  335: { cardId: 335, type: 'field', description: 'All Fiend and Spellcaster monsters gain 200 ATK and DEF.', value: 200, targetType: 'all' },
};

// Get effect for a card
export function getCardEffect(cardId: number): CardEffect | undefined {
  return CARD_EFFECTS[cardId];
}

// Get card description text
export function getCardText(cardId: number): string {
  const effect = CARD_EFFECTS[cardId];
  return effect ? effect.description : '';
}

// Check if card has an effect
export function hasEffect(cardId: number): boolean {
  return cardId in CARD_EFFECTS;
}
