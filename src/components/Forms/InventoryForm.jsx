import { useState } from 'react';

function InventoryForm({ onSubmit, onCancel, initialData = {} }) {
    const isEditing = !!initialData.id;
    const [itemName, setItemName] = useState(initialData.itemName || '');
    const [desc, setDesc] = useState(initialData.desc || '');
    const [qty, setQty] = useState(initialData.qty ?? 1);
    const [value, setValue] = useState(initialData.value == null ? '' : String(initialData.value));
    const [magic, setMagic] = useState(!!initialData.magic);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            itemName,
            desc,
            qty: Number(qty) || 1,
            value: value === '' ? undefined : Number(value),
            magic,
        });

        if (!isEditing) {
            setItemName('');
            setDesc('');
            setQty(1);
            setValue('');
            setMagic(false);
        }
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
                <button type="submit">{isEditing ? 'Save Changes' : 'Add Item'}</button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>Cancel</button>
                )}
            </div>
        </form>
    );
}

export default InventoryForm;
