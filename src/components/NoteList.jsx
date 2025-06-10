import { Link } from 'react-router-dom';
import styles from './NoteList.module.css';
import { format } from 'date-fns';

const NoteList = ({ notes }) => {
    if (!notes?.length) return <p className={styles.empty}>No session notes found.</p>;

    return (
        <div className={styles.list}>
            {notes.map((note) => (
                <Link
                    to={`/notes/${note._id}`}
                    key={note._id}
                >
                    <div key={note._id} className={styles.card}>
                        <div className={styles.header}>
                            <h3>{note.campaignTitle}</h3>
                            <span>{format(new Date(note.sessionDate), 'PPP')}</span>
                        </div>

                        <p className={styles.preview}>
                            <strong>Memorable Moments:</strong>{' '}
                            {note.memorableMoments?.slice(0, 150) || '-'}
                        </p>

                        <div className={styles.meta}>
                            <span>
                                <strong>Visibility:</strong> {note.visibility}
                            </span>
                            {note.sharedWith?.length > 0 && (
                                <span>
                                    <strong>Shared With:</strong> {note.sharedWith.length} member(s)
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default NoteList;