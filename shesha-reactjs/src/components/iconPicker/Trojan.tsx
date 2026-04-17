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
import { Input, Radio, RadioChangeEvent } from "antd";
import { useStyles } from "./styles/styles";

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

// ─── Main component ───────────────────────────────────────────────────────────

const LIBRARY_OPTIONS = ICON_LIBRARIES.map((lib) => ({
  label: lib.label,
  value: lib.key,
}));

export const IconPicker: React.FC<IconPickerProps> = ({
  onSelect,
  selectedIcon,
  iconSize = 30,
  className,
  style: styleProp,
}) => {
  const { styles } = useStyles();
  const [activeLib, setActiveLib] = useState<LibraryKey>(ICON_LIBRARIES[0].key);
  const [query, setQuery] = useState("");

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

  const handleLibChange = useCallback((e: RadioChangeEvent) => {
    setActiveLib(e.target.value);
    setQuery("");
  }, []);

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className={className} style={styleProp}>
      <div className={styles.shaIconPickerSearch}>
        <Radio.Group
          options={LIBRARY_OPTIONS}
          value={activeLib}
          onChange={handleLibChange}
          optionType="button"
          size="small"
        />
        <div className={styles.shaIconPickerSearchInputContainer}>
          <Input.Search
            allowClear
            onChange={onSearchChange}
            value={query}
            placeholder={`Search ${icons.length.toLocaleString()} icons...`}
          />
        </div>
      </div>

      <div className={styles.shaIconPickerIconList}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            Loading icons...
          </div>
        ) : error ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: '#ef4444' }}>
            Failed to load icons: {error.message}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            No icons match your search.
          </div>
        ) : (
          <div className={styles.shaIconPickerIconListGroupBody}>
            {filtered.map(({ name, Component }) => (
              <span
                key={name}
                className={styles.shaIconPickerIconListIcon}
                onClick={() => handleSelect({ name, Component })}
                title={name}
              >
                <Component size={iconSize} style={{ transform: 'scale(.83)' }} />
                <span className={styles.shaIconPickerIconListIconName}>{name}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IconPicker;
