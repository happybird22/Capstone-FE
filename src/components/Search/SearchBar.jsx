import styles from './SearchBar.module.css';

const SearchBar = ({ value, onChange }) => {
    return (
        <input
        className={styles.searchInput}
        type="text"
        placeholder="Search NPCs, Places, Notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default SearchBar;