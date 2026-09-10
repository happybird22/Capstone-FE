import styles from './SearchBar.module.css';

const SearchBar = ({ value, onChange, placeholder = 'Search NPCs, Places, Notes...' }) => {
    return (
        <input
        className={styles.searchInput}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default SearchBar;