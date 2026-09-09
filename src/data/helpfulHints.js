// Original, independently-written summaries of general D&D 5e mechanics for quick
// in-session reference. Rules and mechanics are not copyrightable, only specific
// published wording is — so this content is paraphrased in our own words rather
// than copied from any Wizards of the Coast book or the SRD, and no OGL
// attribution is required. See the disclaimer on the Helpful Hints page for the
// trademark note (this app is not affiliated with or endorsed by Wizards of the Coast).

export const combatActions = [
  { name: 'Attack', summary: 'Make one melee or ranged attack. Some features let you attack more than once when you take this action.' },
  { name: 'Dash', summary: 'Gain extra movement for the turn, equal to your speed.' },
  { name: 'Disengage', summary: 'Your movement this turn doesn’t provoke opportunity attacks.' },
  { name: 'Dodge', summary: 'Until your next turn, attacks against you have disadvantage (if you can see the attacker) and you have advantage on Dexterity saves.' },
  { name: 'Help', summary: 'Give an ally advantage on their next ability check for a task you assist with, or on their next attack against a creature adjacent to you.' },
  { name: 'Hide', summary: 'Make a Stealth check to try to become unseen and unheard.' },
  { name: 'Ready', summary: 'Pick a trigger and an action or movement to take when it happens; you act on the trigger using your reaction.' },
  { name: 'Search', summary: 'Devote your attention to finding something, usually with a Perception or Investigation check.' },
  { name: 'Use an Object', summary: 'Interact with a second object this turn, or use an object that requires its own action to operate.' },
  { name: 'Grapple', summary: 'A special melee attack replacing a normal attack: contest your Athletics against the target’s Athletics or Acrobatics to grab and restrain their movement.' },
  { name: 'Shove', summary: 'A special melee attack replacing a normal attack: contest your Athletics against the target’s Athletics or Acrobatics to knock them prone or push them 5 feet.' },
];

export const conditions = [
  { name: 'Blinded', summary: 'Can’t see, automatically fails sight-based checks, attacks against you have advantage, and your attacks have disadvantage.' },
  { name: 'Charmed', summary: 'Can’t attack the charmer or target them with harmful effects; the charmer has advantage on social checks against you.' },
  { name: 'Deafened', summary: 'Can’t hear, and automatically fails hearing-based checks.' },
  { name: 'Frightened', summary: 'Disadvantage on ability checks and attacks while the source of fear is in sight, and can’t willingly move closer to it.' },
  { name: 'Grappled', summary: 'Speed becomes 0 and can’t benefit from any speed bonus; ends if the grappler is incapacitated or you’re moved out of the grappler’s reach.' },
  { name: 'Incapacitated', summary: 'Can’t take actions or reactions.' },
  { name: 'Invisible', summary: 'Impossible to see without magic or special senses; you’re heavily obscured for hiding purposes, attacks against you have disadvantage, and yours have advantage.' },
  { name: 'Paralyzed', summary: 'Incapacitated and can’t move or speak; automatically fails Strength and Dexterity saves; attacks against you have advantage and any hit from within 5 feet is a critical hit.' },
  { name: 'Petrified', summary: 'Turned to stone along with any nonmagical objects worn or carried; incapacitated, can’t move or speak, is resistant to all damage, and is immune to poison and disease.' },
  { name: 'Poisoned', summary: 'Disadvantage on attack rolls and ability checks.' },
  { name: 'Prone', summary: 'Can only crawl unless it stands up; disadvantage on attack rolls; attacks against you have advantage if the attacker is within 5 feet, otherwise disadvantage.' },
  { name: 'Restrained', summary: 'Speed becomes 0; attacks against you have advantage, yours have disadvantage, and you have disadvantage on Dexterity saves.' },
  { name: 'Stunned', summary: 'Incapacitated, can’t move, and can speak only falteringly; automatically fails Strength and Dexterity saves; attacks against you have advantage.' },
  { name: 'Unconscious', summary: 'Incapacitated, can’t move or speak, and is unaware of surroundings; drops what it’s holding and falls prone; automatically fails Strength and Dexterity saves; attacks against you have advantage and any hit from within 5 feet is a critical hit.' },
];

export const damageTypes = [
  { name: 'Acid', summary: 'Corrosive chemical damage, such as from a splash of caustic liquid.' },
  { name: 'Bludgeoning', summary: 'Blunt-force impact damage, like hammers, falling, or a slam attack.' },
  { name: 'Cold', summary: 'Freezing damage from ice or frigid magic.' },
  { name: 'Fire', summary: 'Burning damage from flames or heat.' },
  { name: 'Force', summary: 'Pure magical energy, unaligned with any element.' },
  { name: 'Lightning', summary: 'Electrical damage from bolts or arcs of electricity.' },
  { name: 'Necrotic', summary: 'Withering, life-draining negative energy.' },
  { name: 'Piercing', summary: 'Puncturing damage from stabbing or impaling weapons.' },
  { name: 'Poison', summary: 'Toxin-based damage from venom or noxious substances.' },
  { name: 'Psychic', summary: 'Mental damage that assaults the mind directly.' },
  { name: 'Radiant', summary: 'Searing positive energy, often tied to holy or celestial sources.' },
  { name: 'Slashing', summary: 'Cutting damage from bladed weapons or claws.' },
  { name: 'Thunder', summary: 'Concussive sound-based damage from a burst of noise.' },
];

export const exhaustionLevels = [
  { level: 1, summary: 'Disadvantage on ability checks.' },
  { level: 2, summary: 'Speed is halved (in addition to prior effects).' },
  { level: 3, summary: 'Disadvantage on attack rolls and saving throws (in addition to prior effects).' },
  { level: 4, summary: 'Hit point maximum is halved (in addition to prior effects).' },
  { level: 5, summary: 'Speed drops to 0 (in addition to prior effects).' },
  { level: 6, summary: 'Death.' },
];
