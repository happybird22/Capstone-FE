import { useState } from 'react';

function InventoryForm({ onSubmit, onCancel }) {
    const [itemName, setItemName] = useState('');
    const [desc, setDesc] = useState('');
    const [qty, setQty] = useState(1);
    const [value, setValue] = useState('');
    const [magic, setMagic] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            itemName,
            desc,
            qty: Number(qty) || 1,
            value: value === '' ? undefined : Number(value),
            magic,
        });
        setItemName('');
        setDesc('');
        setQty(1);
        setValue('');
        setMagic(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Item Name:
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />
            </label>

            <label>Description:
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
            </label>

            <label>Quantity:
                <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                />
            </label>

            <label>Value (gp):
                <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={magic}
                    onChange={(e) => setMagic(e.target.checked)}
                />
                {' '}Magical Item
            </label>

            <div>
                <button type="submit">Add Item</button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>Cancel</button>
                )}
            </div>
        </form>
    );
}

export default InventoryForm;
