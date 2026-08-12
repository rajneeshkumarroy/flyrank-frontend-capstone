import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const baseId = useId();

  const getTabId = (index: number) =>
    `${baseId}-tab-${index}`;

  const getPanelId = (index: number) =>
    `${baseId}-panel-${index}`;

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex = index;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length;
        break;

      case "ArrowLeft":
        nextIndex =
          (index - 1 + tabs.length) % tabs.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = tabs.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();
    setActiveTab(nextIndex);

    const nextTab = document.getElementById(
      getTabId(nextIndex)
    );

    nextTab?.focus();
  };

  return (
    <div className="tabs">
      <div
        className="tab-list"
        role="tablist"
        aria-label="Example tabs"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;

          return (
            <button
              key={tab.id}
              id={getTabId(index)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={getPanelId(index)}
              tabIndex={isActive ? 0 : -1}
              className={`tab ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
              onKeyDown={(event) =>
                handleKeyDown(event, index)
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, index) => {
        const isActive = activeTab === index;

        if (!isActive) {
          return null;
        }

        return (
          <div
            key={tab.id}
            id={getPanelId(index)}
            role="tabpanel"
            aria-labelledby={getTabId(index)}
            tabIndex={0}
            className="tab-panel"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}