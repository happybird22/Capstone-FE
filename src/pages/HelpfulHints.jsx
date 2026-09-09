import { useState } from 'react';
import { combatActions, conditions, damageTypes, exhaustionLevels } from '../data/helpfulHints';
import styles from './HelpfulHints.module.css';

const CATEGORIES = [
  { key: 'combat', label: 'Combat Actions' },
  { key: 'conditions', label: 'Status Effects' },
  { key: 'damage', label: 'Damage Types' },
  { key: 'exhaustion', label: 'Exhaustion' },
];

const HelpfulHints = () => {
  const [category, setCategory] = useState('combat');
  const [search, setSearch] = useState('');

  const filterByName = (items) => {
    if (!search.trim()) return items;
    const term = search.trim().toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(term));
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Helpful Hints</h1>
      <p className={styles.subheading}>
        Quick reference for common combat actions, status effects, damage types, and exhaustion levels.
      </p>

      <div className={styles.controls}>
        <div className={styles.tabs}>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={category === c.key ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {category !== 'exhaustion' && (
          <input
            className={styles.search}
            type="text"
            placeholder="Filter by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {category === 'combat' && (
        <div className={styles.grid}>
          {filterByName(combatActions).map((item) => (
            <div key={item.name} className={styles.card}>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}

      {category === 'conditions' && (
        <div className={styles.grid}>
          {filterByName(conditions).map((item) => (
            <div key={item.name} className={styles.card}>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}

      {category === 'damage' && (
        <div className={styles.grid}>
          {filterByName(damageTypes).map((item) => (
            <div key={item.name} className={styles.card}>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}

      {category === 'exhaustion' && (
        <div className={styles.grid}>
          {exhaustionLevels.map((item) => (
            <div key={item.level} className={styles.card}>
              <h3>Level {item.level}</h3>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}

      <p className={styles.disclaimer}>
        Content on this page is an original, independently written summary of general tabletop RPG
        mechanics for reference purposes. This app is not affiliated with, endorsed by, or sponsored
        by Wizards of the Coast.
      </p>
    </main>
  );
};

export default HelpfulHints;
