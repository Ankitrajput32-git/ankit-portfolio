/** Renders "[ADD: ...]" notes inside a line as placeholders, the rest as plain text. */
export function WithNotes({ text }: { text: string }) {
  const parts = text.split(/(\[ADD:[^\]]*\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[ADD:") ? (
          <span key={i} className="add-note">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
