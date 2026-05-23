/**
 * Sample TSX (React + TypeScript) file for VS Code theme preview.
 * Demonstrates modern React 18+ patterns with TypeScript.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type FC,
  type ReactNode,
  type PropsWithChildren,
} from "react";

// ─── Types & Interfaces ─────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
}

interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
  };
}

type SortDirection = "asc" | "desc";
type SortField = keyof Pick<User, "name" | "email" | "createdAt">;

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface FilterConfig {
  search: string;
  role: User["role"] | "all";
  dateRange?: { from: Date; to: Date };
}

// ─── Utility Types ───────────────────────────────────────────────
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type CreateUserInput = Optional<User, "id" | "createdAt">;

// ─── Enums ───────────────────────────────────────────────────────
enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

enum StatusBadgeVariant {
  Success = "success",
  Warning = "warning",
  Error = "error",
  Info = "info",
}

// ─── Constants ───────────────────────────────────────────────────
const API_BASE = "https://api.example.com" as const;
const ITEMS_PER_PAGE = 20;
const DEBOUNCE_MS = 300;

const ROLE_LABELS: Record<User["role"], string> = {
  admin: "Administrator",
  user: "Regular User",
  moderator: "Moderator",
};

const BADGE_COLORS: Record<StatusBadgeVariant, string> = {
  [StatusBadgeVariant.Success]: "#22c55e",
  [StatusBadgeVariant.Warning]: "#f59e0b",
  [StatusBadgeVariant.Error]: "#ef4444",
  [StatusBadgeVariant.Info]: "#3b82f6",
};

// ─── Custom Hooks ────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number = DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(setData)
      .catch((err: Error) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error } as const;
}

// ─── Reducer ─────────────────────────────────────────────────────
interface TableState {
  users: User[];
  sort: SortConfig;
  filter: FilterConfig;
  selectedIds: Set<string>;
  isLoading: boolean;
}

type TableAction =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_SORT"; payload: SortConfig }
  | { type: "SET_FILTER"; payload: Partial<FilterConfig> }
  | { type: "TOGGLE_SELECT"; payload: string }
  | { type: "SELECT_ALL" }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_LOADING"; payload: boolean };

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload, isLoading: false };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_FILTER":
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
        selectedIds: new Set(),
      };
    case "TOGGLE_SELECT": {
      const next = new Set(state.selectedIds);
      next.has(action.payload)
        ? next.delete(action.payload)
        : next.add(action.payload);
      return { ...state, selectedIds: next };
    }
    case "SELECT_ALL":
      return {
        ...state,
        selectedIds: new Set(state.users.map((u) => u.id)),
      };
    case "CLEAR_SELECTION":
      return { ...state, selectedIds: new Set() };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", Theme.System);
  const isDark = useMemo(() => {
    if (theme === Theme.System) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === Theme.Dark;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Generic Components ──────────────────────────────────────────
interface BadgeProps {
  variant?: StatusBadgeVariant;
  children: ReactNode;
  className?: string;
}

const Badge: FC<BadgeProps> = ({
  variant = StatusBadgeVariant.Info,
  children,
  className = "",
}) => (
  <span
    className={`badge badge--${variant} ${className}`.trim()}
    style={{ backgroundColor: BADGE_COLORS[variant] }}
    role="status"
  >
    {children}
  </span>
);

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState: FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  description,
  action,
}) => (
  <div className="empty-state" role="status" aria-label={title}>
    <span className="empty-state__icon" aria-hidden="true">
      {icon}
    </span>
    <h3 className="empty-state__title">{title}</h3>
    {description && <p className="empty-state__desc">{description}</p>}
    {action && (
      <button className="btn btn--primary" onClick={action.onClick}>
        {action.label}
      </button>
    )}
  </div>
);

// ─── User Table Component ────────────────────────────────────────
interface UserTableProps {
  initialUsers?: User[];
  onUserSelect?: (user: User) => void;
  onBulkAction?: (action: string, userIds: string[]) => Promise<void>;
}

const UserTable: FC<UserTableProps> = ({
  initialUsers = [],
  onUserSelect,
  onBulkAction,
}) => {
  const { isDark } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(tableReducer, {
    users: initialUsers,
    sort: { field: "name", direction: "asc" },
    filter: { search: "", role: "all" },
    selectedIds: new Set<string>(),
    isLoading: false,
  });

  const debouncedSearch = useDebounce(state.filter.search);

  // Memoized filtered & sorted users
  const filteredUsers = useMemo(() => {
    let result = [...state.users];

    // Filter by search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    // Filter by role
    if (state.filter.role !== "all") {
      result = result.filter((u) => u.role === state.filter.role);
    }

    // Sort
    const { field, direction } = state.sort;
    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === "asc" ? cmp : -cmp;
    });

    return result;
  }, [state.users, debouncedSearch, state.filter.role, state.sort]);

  const handleSort = useCallback((field: SortField) => {
    dispatch({
      type: "SET_SORT",
      payload: {
        field,
        direction:
          state.sort.field === field && state.sort.direction === "asc"
            ? "desc"
            : "asc",
      },
    });
  }, [state.sort]);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (state.isLoading) {
    return <div className="loading-spinner" aria-label="Loading users" />;
  }

  return (
    <div className={`user-table ${isDark ? "user-table--dark" : ""}`}>
      {/* Toolbar */}
      <div className="user-table__toolbar">
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search users... (⌘K)"
          value={state.filter.search}
          onChange={(e) =>
            dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })
          }
          aria-label="Search users"
        />

        <select
          value={state.filter.role}
          onChange={(e) =>
            dispatch({
              type: "SET_FILTER",
              payload: { role: e.target.value as FilterConfig["role"] },
            })
          }
          aria-label="Filter by role"
        >
          <option value="all">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {state.selectedIds.size > 0 && (
          <Badge variant={StatusBadgeVariant.Info}>
            {state.selectedIds.size} selected
          </Badge>
        )}
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No users found"
          description="Try adjusting your search or filter criteria."
          action={{
            label: "Clear filters",
            onClick: () =>
              dispatch({
                type: "SET_FILTER",
                payload: { search: "", role: "all" },
              }),
          }}
        />
      ) : (
        <table role="grid" aria-label="Users table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={state.selectedIds.size === filteredUsers.length}
                  onChange={() =>
                    dispatch({
                      type:
                        state.selectedIds.size === filteredUsers.length
                          ? "CLEAR_SELECTION"
                          : "SELECT_ALL",
                    })
                  }
                  aria-label="Select all users"
                />
              </th>
              {(["name", "email", "createdAt"] as const).map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  style={{ cursor: "pointer" }}
                  aria-sort={
                    state.sort.field === field
                      ? state.sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {state.sort.field === field &&
                    (state.sort.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => onUserSelect?.(user)}
                className={
                  state.selectedIds.has(user.id) ? "row--selected" : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    checked={state.selectedIds.has(user.id)}
                    onChange={() =>
                      dispatch({ type: "TOGGLE_SELECT", payload: user.id })
                    }
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${user.name}`}
                  />
                </td>
                <td>
                  <div className="user-cell">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt=""
                        className="user-cell__avatar"
                      />
                    )}
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.createdAt.toLocaleDateString()}</td>
                <td>
                  <Badge
                    variant={
                      user.role === "admin"
                        ? StatusBadgeVariant.Error
                        : user.role === "moderator"
                        ? StatusBadgeVariant.Warning
                        : StatusBadgeVariant.Info
                    }
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ─── App Component ───────────────────────────────────────────────
const App: FC = () => {
  const sampleUsers: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "admin", createdAt: new Date("2024-01-15") },
    { id: "2", name: "Bob", email: "bob@example.com", role: "user", createdAt: new Date("2024-03-22") },
    { id: "3", name: "Charlie", email: "charlie@example.com", role: "moderator", createdAt: new Date("2024-06-10") },
  ];

  return (
    <ThemeProvider>
      <main className="app">
        <h1>User Management</h1>
        <UserTable
          initialUsers={sampleUsers}
          onUserSelect={(user) => console.log("Selected:", user)}
        />
      </main>
    </ThemeProvider>
  );
};

export default App;
export { UserTable, Badge, EmptyState, ThemeProvider, useTheme, useDebounce };
export type { User, ApiResponse, BadgeProps, UserTableProps };
