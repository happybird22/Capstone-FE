import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InventoryForm from '../components/Forms/InventoryForm';
import { useAuth } from '../context/authContext';
import {
    subscribeToPartyBankItems,
    addPartyBankItem,
    updatePartyBankItem,
    removePartyBankItem,
} from '../services/partyBank.service';
import styles from './PartyBank.module.css';

const PartyBank = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (!user?.partyId) {
            setItems([]);
            return;
        }

        const unsubscribe = subscribeToPartyBankItems(user.partyId, setItems);
        return unsubscribe;
    }, [user?.partyId]);

    if (!user?.partyId) {
        return (
            <main className={styles.page}>
                <h1 className={styles.heading}>Party Bank</h1>
                <p className={styles.empty}>
                    You'll need to join or create a campaign before you can use the Party Bank.{' '}
                    <Link to="/parties/create">Join or create a campaign</Link>
                </p>
            </main>
        );
    }

    const handleAddItem = async (item) => {
        try {
            await addPartyBankItem(user.partyId, item, user.uid);
            setShowForm(false);
        } catch (err) {
            console.error('Failed to add item', err);
            alert('There was an error adding that item.');
        }
    };

    const handleUpdateItem = async (itemId, item) => {
        try {
            await updatePartyBankItem(user.partyId, itemId, item);
            setEditingId(null);
        } catch (err) {
            console.error('Failed to update item', err);
            alert('There was an error saving that item.');
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await removePartyBankItem(user.partyId, id);
        } catch (err) {
            console.error('Failed to remove item', err);
        }
    };

    const totalValue = items.reduce((sum, item) => sum + (item.value || 0) * item.qty, 0);

    return (
        <main className={styles.page}>
            <h1 className={styles.heading}>Party Bank</h1>
            <p className={styles.notice}>
                Shared live with your whole party — everyone sees the same inventory in real time.
            </p>

            <div className={styles.topRow}>
                <p className={styles.total}><strong>Total Value:</strong> {totalValue} gp</p>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        setEditingId(null);
                        setShowForm((s) => !s);
                    }}
                >
                    {showForm ? 'Close' : 'Add Item'}
                </button>
            </div>

            {showForm && (
                <div className={styles.formWrapper}>
                    <InventoryForm onSubmit={handleAddItem} onCancel={() => setShowForm(false)} />
                </div>
            )}

            {items.length === 0 ? (
                <p className={styles.empty}>No items in the party bank yet.</p>
            ) : (
                <div className={styles.grid}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.card}>
                            {editingId === item.id ? (
                                <InventoryForm
                                    key={item.id}
                                    initialData={item}
                                    onSubmit={(data) => handleUpdateItem(item.id, data)}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <>
                                    <div className={styles.cardHeader}>
                                        <h3>{item.itemName}</h3>
                                        {item.magic && <span className={styles.magicBadge}>Magical</span>}
                                    </div>
                                    {item.desc && <p className={styles.desc}>{item.desc}</p>}
                                    <div className={styles.meta}>
                                        <span>Qty: {item.qty}</span>
                                        {item.value !== undefined && item.value !== null && <span>Value: {item.value} gp</span>}
                                    </div>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingId(item.id);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button className={styles.removeButton} onClick={() => handleRemoveItem(item.id)}>
                                        Remove
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default PartyBank;
