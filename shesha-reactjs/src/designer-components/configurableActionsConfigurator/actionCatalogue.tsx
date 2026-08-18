import { FC, useMemo, useState } from 'react';
import { Input, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { IConfigurableActionGroupDictionary } from '@/providers/configurableActionsDispatcher/models';
import { isNullOrWhiteSpace } from '@/utils/nullables';
import { useStyles } from './styles';

export interface ICatalogueAction {
  fullName: string;
  label: string;
  description: string | undefined;
  hasArguments: boolean;
}

export interface ICatalogueGroup {
  owner: string;
  ownerName: string;
  actions: ICatalogueAction[];
}

export const getActionFullName = (owner: string, name: string): string => owner ? `${owner}:${name}` : name;

export const buildCatalogue = (actions: IConfigurableActionGroupDictionary): ICatalogueGroup[] => {
  const result: ICatalogueGroup[] = [];

  for (const owner in actions) {
    if (!actions.hasOwnProperty(owner))
      continue;
    const group = actions[owner];
    if (!group)
      continue;

    const sorted = [...group.actions].sort((a, b) => {
      const orderA = a.sortOrder ?? 999;
      const orderB = b.sortOrder ?? 999;
      if (orderA !== orderB)
        return orderA - orderB;
      return (a.label ?? a.name).toLowerCase().localeCompare((b.label ?? b.name).toLowerCase());
    });

    result.push({
      owner,
      ownerName: group.ownerName,
      actions: sorted.map((action) => ({
        fullName: getActionFullName(owner, action.name),
        label: action.label ?? action.name,
        description: action.description,
        hasArguments: action.hasArguments,
      })),
    });
  }

  return result;
};

const matches = (haystack: string | undefined, needle: string): boolean =>
  !isNullOrWhiteSpace(haystack) && haystack.toLowerCase().includes(needle);

interface IActionCatalogueProps {
  groups: ICatalogueGroup[];
  value: string | null | undefined;
  onSelect: (fullName: string) => void;
  readOnly: boolean;
}

export const ActionCatalogue: FC<IActionCatalogueProps> = ({ groups, value, onSelect, readOnly }) => {
  const { styles } = useStyles();
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo<ICatalogueGroup[]>(() => {
    const needle = search.trim().toLowerCase();
    if (!needle)
      return groups;

    return groups
      .map((group) => matches(group.ownerName, needle)
        ? group
        : { ...group, actions: group.actions.filter((a) => matches(a.label, needle) || matches(a.description, needle)) })
      .filter((group) => group.actions.length > 0);
  }, [groups, search]);

  const total = useMemo(() => filtered.reduce((sum, g) => sum + g.actions.length, 0), [filtered]);

  return (
    <div className={styles.catalogue}>
      <div className={styles.catalogueSearch}>
        <Input
          allowClear
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search actions"
          prefix={<SearchOutlined />}
        />
      </div>
      <div className={styles.catalogueList}>
        {total === 0 && (
          <div className={styles.catalogueEmpty}>No actions match “{search}”</div>
        )}
        {filtered.map((group) => (
          <div key={group.owner}>
            <div className={styles.catalogueGroup}>
              <span className="name" title={group.ownerName}>{group.ownerName}</span>
              <span className="count">{group.actions.length}</span>
            </div>
            {group.actions.map((action) => (
              <button
                type="button"
                key={action.fullName}
                disabled={readOnly}
                className={`${styles.catalogueItem}${action.fullName === value ? ' selected' : ''}`}
                onClick={() => onSelect(action.fullName)}
              >
                <span className="label">
                  {action.label}
                  {action.hasArguments && <Tag variant="filled">args</Tag>}
                </span>
                {!isNullOrWhiteSpace(action.description) && (
                  <span className="description">{action.description}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
