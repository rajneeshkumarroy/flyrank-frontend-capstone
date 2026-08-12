import { useId, useState } from "react";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export default function Disclosure({
  title,
  children,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="disclosure">
      <h2 className="disclosure-heading">
        <button
          type="button"
          className="disclosure-button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{title}</span>
          <span aria-hidden="true">
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </h2>

      {isOpen && (
        <div
          id={contentId}
          className="disclosure-content"
        >
          {children}
        </div>
      )}
    </div>
  );
}