import styles from './SearchBar.module.css';

const SearchBar = () => {
    return (
        <input
        className={styles.searchInput}
        type="text"
        placeholder="Search NPCs, Places, Notes..."
        />
    );
};

export default SearchBar;