export interface Card {
  id: number;
  name: string;
  atk?: number;
  def?: number;
  type: "Monster" | "Spell" | "Trap";
  attr?: "EARTH" | "WATER" | "FIRE" | "WIND" | "LIGHT" | "DARK";
  race?: string;
  level?: number;
  text?: string;
}