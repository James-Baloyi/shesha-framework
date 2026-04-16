/**
 * IconPicker.tsx
 *
 * A searchable icon selection tray with style (library) switcher.
 * Lazily loads each react-icons family on demand to keep bundles small.
 *
 * Usage:
 *   <IconPicker onSelect={(name, lib) => console.log(name, lib)} />
 *
 * Dependencies:
 *   npm install react-icons
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import type { IconType } from "react-icons";

// ─── Library registry ─────────────────────────────────────────────────────────

export type LibraryKey =
  | "fa"    // Font Awesome 5 Solid
  | "fa6"   // Font Awesome 6
  | "md"    // Material Design
  | "hi2"   // Heroicons v2 (outline)
  | "hi"    // Heroicons v1 (solid)
  | "bs"    // Bootstrap Icons
  | "ri"    // Remix Icons
  | "lu";   // Lucide

export interface LibraryMeta {
  key: LibraryKey;
  label: string;
  style: "solid" | "outline" | "mixed";
  /** Colour used in the style tab badge */
  accent: string;
  loader: () => Promise<Record<string, IconType>>;
}

export const ICON_LIBRARIES: LibraryMeta[] = [
  {
    key: "fa",
    label: "Font Awesome",
    style: "solid",
    accent: "#528DD7",
    loader: () =>
      import("react-icons/fa").then((m) => m as unknown as Record<string, IconType>),
  },
  {
    key: "fa6",
    label: "FA 6",
    style: "mixed",
    accent: "#3B82F6",
    loader: () =>
      import("react-icons/fa6").then((m) => m as unknown as Record<string, IconType>),
  },
  {
    key: "md",
    label: "Material",
    style: "mixed",
    accent: "#34A853",
    loader: () =>
      import("react-icons/md").then((m) => m as unknown as Record<string, IconType>),
  },
  {
    key: "hi2",
    label: "Heroicons",
    style: "outline",
    accent: "#A78BFA",
    loader: () =>
      import("react-icons/hi2").then((m) => m as unknown as Record<string, IconType>),
  },
  {
    key: "bs",
    label: "Bootstrap",
    style: "mixed",
    accent: "#7952B3",
    loader: () =>
      import("react-icons/bs").then((m) => m as unknown as Record<string, IconType>),
  },
  {
    key: "ri",
    label: "Remix",
    style: "mixed",
    accent: "#F97316",
    loader: () =>
      import("react-icons/ri").then((m) => m as unknown as Record<string, IconType>),
  },
  {
    key: "lu",
    label: "Lucide",
    style: "outline",
    accent: "#EC4899",
    loader: () =>
      import("react-icons/lu").then((m) => m as unknown as Record<string, IconType>),
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IconEntry {
  name: string;
  Component: IconType;
}

export interface IconPickerProps {
  /** Called when the user clicks an icon */
  onSelect?: (iconName: string, library: LibraryKey, Component: IconType) => void;
  /** Currently selected icon name (controlled) */
  selectedIcon?: string;
  /** Icon size in px rendered in the grid cells */
  iconSize?: number;
  /** Number of columns in the grid */
  columns?: number;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Hook: lazy-load an icon library ──────────────────────────────────────────

interface UseIconLibraryResult {
  icons: IconEntry[];
  loading: boolean;
  error: Error | null;
}

const cache: Partial<Record<LibraryKey, IconEntry[]>> = {};

function useIconLibrary(key: LibraryKey): UseIconLibraryResult {
  const [icons, setIcons] = useState<IconEntry[]>(() => cache[key] ?? []);
  const [loading, setLoading] = useState<boolean>(!cache[key]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cache[key]) {
      setIcons(cache[key]!);
      setLoading(false);
      return;
    }

    const meta = ICON_LIBRARIES.find((l) => l.key === key);
    if (!meta) return;

    setLoading(true);
    setError(null);

    meta
      .loader()
      .then((mod) => {
        const entries: IconEntry[] = Object.entries(mod)
          // react-icons modules may export non-component values; filter them
          .filter(([, v]) => typeof v === "function")
          .map(([name, Component]) => ({ name, Component: Component as IconType }));

        cache[key] = entries;
        setIcons(entries);
      })
      .catch((err: Error) => setError(err))
      .finally(() => setLoading(false));
  }, [key]);

  return { icons, loading, error };
}

// ─── Hook: debounced search ────────────────────────────────────────────────────

function useDebounce<T>(value: T, ms = 200): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StyleTabsProps {
  libraries: LibraryMeta[];
  active: LibraryKey;
  onChange: (key: LibraryKey) => void;
}

const StyleTabs: React.FC<StyleTabsProps> = ({ libraries, active, onChange }) => (
  <div style={styles.tabs}>
    {libraries.map((lib) => (
      <button
        key={lib.key}
        onClick={() => onChange(lib.key)}
        title={lib.label}
        style={{
          ...styles.tab,
          ...(active === lib.key ? { ...styles.tabActive, borderColor: lib.accent } : {}),
        }}
      >
        <span
          style={{
            ...styles.tabDot,
            background: lib.accent,
          }}
        />
        <span style={styles.tabLabel}>{lib.label}</span>
      </button>
    ))}
  </div>
);

interface IconGridProps {
  icons: IconEntry[];
  selectedIcon?: string;
  iconSize: number;
  columns: number;
  onSelect: (entry: IconEntry) => void;
}

/** Simple windowed grid — swap for react-window for 1000+ icons in production */
const IconGrid: React.FC<IconGridProps> = ({
  icons,
  selectedIcon,
  iconSize,
  columns,
  onSelect,
}) => {
  if (icons.length === 0) {
    return <div style={styles.emptyState}>No icons match your search.</div>;
  }

  return (
    <div
      style={{
        ...styles.grid,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {icons.map(({ name, Component }) => (
        <button
          key={name}
          title={name}
          aria-label={name}
          aria-pressed={name === selectedIcon}
          onClick={() => onSelect({ name, Component })}
          style={{
            ...styles.cell,
            ...(name === selectedIcon ? styles.cellSelected : {}),
          }}
        >
          <Component size={iconSize} />
        </button>
      ))}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const IconPicker: React.FC<IconPickerProps> = ({
  onSelect,
  selectedIcon,
  iconSize = 20,
  columns = 8,
  className,
  style: styleProp,
}) => {
  const [activeLib, setActiveLib] = useState<LibraryKey>(ICON_LIBRARIES[0].key);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 200);
  const { icons, loading, error } = useIconLibrary(activeLib);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return icons;
    return icons.filter(({ name }) => name.toLowerCase().includes(q));
  }, [icons, debouncedQuery]);

  const handleSelect = useCallback(
    (entry: IconEntry) => {
      onSelect?.(entry.name, activeLib, entry.Component);
    },
    [onSelect, activeLib]
  );

  const handleLibChange = useCallback((key: LibraryKey) => {
    setActiveLib(key);
    setQuery("");
    searchRef.current?.focus();
  }, []);

  return (
    <div className={className} style={{ ...styles.root, ...styleProp }}>
      {/* Style switcher */}
      <StyleTabs
        libraries={ICON_LIBRARIES}
        active={activeLib}
        onChange={handleLibChange}
      />

      {/* Search */}
      <div style={styles.searchWrapper}>
        <input
          ref={searchRef}
          type="search"
          placeholder={`Search ${icons.length.toLocaleString()} icons…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.search}
          aria-label="Search icons"
        />
      </div>

      {/* Results header */}
      <div style={styles.meta}>
        {!loading && !error && (
          <span>
            {filtered.length.toLocaleString()} icon
            {filtered.length !== 1 ? "s" : ""}
            {debouncedQuery ? ` for "${debouncedQuery}"` : ""}
          </span>
        )}
      </div>

      {/* Icon grid */}
      <div style={styles.gridWrapper}>
        {loading ? (
          <div style={styles.statusCenter}>Loading icons…</div>
        ) : error ? (
          <div style={{ ...styles.statusCenter, color: "#ef4444" }}>
            Failed to load icons: {error.message}
          </div>
        ) : (
          <IconGrid
            icons={filtered}
            selectedIcon={selectedIcon}
            iconSize={iconSize}
            columns={columns}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
};

// ─── Inline styles (replace with CSS Modules / Tailwind as needed) ─────────────

const styles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    background: "#0f0f13",
    border: "1px solid #2a2a35",
    borderRadius: 12,
    overflow: "hidden",
    fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
    fontSize: 13,
    color: "#e0e0e0",
    width: 520,
  },
  tabs: {
    display: "flex",
    overflowX: "auto" as const,
    padding: "10px 12px 0",
    gap: 4,
    scrollbarWidth: "none" as const,
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: "6px 6px 0 0",
    border: "1px solid transparent",
    borderBottom: "none",
    background: "transparent",
    color: "#888",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "color 0.15s, background 0.15s",
    fontSize: 12,
  },
  tabActive: {
    background: "#1a1a24",
    color: "#e0e0e0",
    borderTopWidth: 2,
  },
  tabDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  tabLabel: {},
  searchWrapper: {
    padding: "12px 14px 6px",
    background: "#1a1a24",
    borderBottom: "1px solid #2a2a35",
  },
  search: {
    width: "100%",
    background: "#0f0f13",
    border: "1px solid #2a2a35",
    borderRadius: 6,
    padding: "7px 12px",
    color: "#e0e0e0",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  },
  meta: {
    padding: "6px 16px 4px",
    background: "#1a1a24",
    color: "#555",
    fontSize: 11,
    letterSpacing: "0.04em",
    minHeight: 22,
  },
  gridWrapper: {
    height: 320,
    overflowY: "auto" as const,
    background: "#1a1a24",
    padding: 8,
  },
  grid: {
    display: "grid",
    gap: 2,
  },
  cell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    aspectRatio: "1",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 6,
    cursor: "pointer",
    color: "#9ca3af",
    transition: "background 0.1s, color 0.1s, border-color 0.1s",
  },
  cellSelected: {
    background: "#1e3a5f",
    borderColor: "#3b82f6",
    color: "#60a5fa",
  },
  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    color: "#555",
    fontSize: 13,
  },
  statusCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    color: "#888",
  },
} satisfies Record<string, React.CSSProperties>;

export default IconPicker;