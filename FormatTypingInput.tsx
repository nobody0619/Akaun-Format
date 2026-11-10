import { useEffect, useRef, useState } from 'react';
import './format-typing.css';

export type FormatInputMode = 'drag' | 'type';

export type FormatPoolItem = {
  id: string;
  label: string;
  isClone?: boolean;
};

const normalizeAnswer = (text: string) =>
  text.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();

export function findTypedFormatItem<T extends FormatPoolItem>(items: T[], text: string): T | undefined {
  const value = normalizeAnswer(text);
  if (!value) return undefined;

  const matches = (item: T) => normalizeAnswer(item.label) === value;
  return items.find(item => item.isClone && matches(item)) || items.find(matches);
}

export function FormatInputControls({
  mode,
  onChange,
  completed = false
}: {
  mode: FormatInputMode;
  onChange: (mode: FormatInputMode) => void;
  completed?: boolean;
}) {
  return (
    <section className="ft-method" aria-label="Answer method">
      <span className="ft-method-label">Answer:</span>
      <div className="ft-modes">
        <button
          type="button"
          aria-pressed={mode === 'drag'}
          disabled={completed}
          onClick={() => onChange('drag')}
        >
          Drag / Select
        </button>
        <button
          type="button"
          aria-pressed={mode === 'type'}
          disabled={completed}
          onClick={() => onChange('type')}
        >
          Type Answer
        </button>
      </div>
    </section>
  );
}

export function FormatTypingDialog({
  items,
  onAnswer,
  onClose
}: {
  items: FormatPoolItem[];
  onAnswer: (id: string) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    element.showModal();
    return () => {
      if (element.open) element.close();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="ft-dialog"
      aria-labelledby="ft-title"
      aria-describedby="ft-description"
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
    >
      <h2 id="ft-title">Type your answer</h2>
      <p id="ft-description">Enter one name shown in the Items Pool.</p>
      <form
        onSubmit={event => {
          event.preventDefault();
          const item = findTypedFormatItem(items, text);
          if (!item) {
            setError('No matching item. Check the spelling and try again.');
            return;
          }
          onAnswer(item.id);
        }}
      >
        <label>
          Answer
          <input
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={200}
            value={text}
            aria-invalid={!!error}
            aria-describedby={error ? 'ft-error' : undefined}
            onChange={event => {
              setText(event.target.value);
              setError('');
            }}
            placeholder="Example: Jualan"
          />
        </label>
        {error && <p id="ft-error" className="ft-error" role="alert">{error}</p>}
        <div className="ft-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={!text.trim()}>Submit</button>
        </div>
      </form>
    </dialog>
  );
}
