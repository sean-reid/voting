interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div
      role="tablist"
      className="flex overflow-x-auto border-b border-border scrollbar-none"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => {
              const currentIndex = tabs.findIndex((t) => t.id === tab.id);
              let nextIndex = -1;
              if (e.key === "ArrowRight") {
                nextIndex = (currentIndex + 1) % tabs.length;
              } else if (e.key === "ArrowLeft") {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
              } else if (e.key === "Home") {
                nextIndex = 0;
              } else if (e.key === "End") {
                nextIndex = tabs.length - 1;
              }
              if (nextIndex >= 0) {
                const nextTab = tabs[nextIndex];
                if (!nextTab) return;
                e.preventDefault();
                onChange(nextTab.id);
                document.getElementById(`tab-${nextTab.id}`)?.focus();
              }
            }}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
              isActive
                ? "border-b-2 border-terracotta text-terracotta"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
