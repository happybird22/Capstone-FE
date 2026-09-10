import { useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

const toInputValue = (dateTime) => {
    if (!dateTime) return '';
    const date = dateTime.toDate ? dateTime.toDate() : new Date(dateTime);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function ScheduleSessionForm({ onSubmit, onCancel, initialData = {} }) {
    const isEditing = !!initialData.id;
    const [dateTimeValue, setDateTimeValue] = useState(toInputValue(initialData.dateTime));
    const [note, setNote] = useState(initialData.note || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dateTimeValue) return;

        onSubmit({
            dateTime: new Date(dateTimeValue),
            note,
        });

        if (!isEditing) {
            setDateTimeValue('');
            setNote('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Date &amp; Time:
                <input
                    type="datetime-local"
                    value={dateTimeValue}
                    onChange={(e) => setDateTimeValue(e.target.value)}
                    required
                />
            </label>

            <label>Note (optional):
                <textarea value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </label>

            <div>
                <button type="submit">{isEditing ? 'Save Changes' : 'Schedule Session'}</button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>Cancel</button>
                )}
            </div>
        </form>
    );
}

export default ScheduleSessionForm;
