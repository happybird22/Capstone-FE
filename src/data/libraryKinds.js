export const LIBRARY_KINDS = {
    npcs: { label: 'NPC', title: 'NPC Library' },
    places: { label: 'Place', title: 'Relevant Places' },
    history: { label: 'Event', title: 'History' },
    religions: { label: 'Religion', title: 'Religions' },
    factions: { label: 'Faction/Org', title: 'Factions & Orgs' },
    quests: { label: 'Quest', title: 'Quest Log', hasStatus: true, topNav: true },
};

export const isValidLibraryKind = (kind) => Object.hasOwn(LIBRARY_KINDS, kind);
