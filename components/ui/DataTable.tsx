"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tabla genérica con búsqueda, filtros por segmento, orden, selección y paginación.
 * Reemplaza las tablas duplicadas del panel de administración y de seguridad.
 *
 * Dos modos:
 *  - Cliente (por defecto): recibe todas las filas y busca/ordena/pagina en memoria.
 *  - Servidor: si se pasa `server`, la búsqueda y la paginación las resuelve la API
 *    (el componente solo muestra los controles y avisa los cambios).
 */

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Si existe, la columna es ordenable (modo cliente) por este valor. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  className?: string;
}

export interface TableFilter<T> {
  value: string;
  label: string;
  predicate: (row: T) => boolean;
}

export interface ServerPagination {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  /** Se invoca (con debounce) al escribir en el buscador. */
  onSearchChange?: (term: string) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  variant?: "light" | "dark";
  searchPlaceholder?: string;
  /** Texto sobre el que busca el modo cliente. Sin esto no se muestra el buscador (salvo en modo servidor). */
  getSearchText?: (row: T) => string;
  filters?: TableFilter<T>[];
  pageSize?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  /** Contenido a la derecha del buscador (botones, selectores...). */
  toolbar?: ReactNode;
  selectable?: boolean;
  bulkActions?: (selected: T[], clearSelection: () => void) => ReactNode;
  initialSort?: { key: string; direction: "asc" | "desc" };
  rowClassName?: (row: T) => string | undefined;
  server?: ServerPagination;
  /** Etiqueta para el contador (p. ej. "usuario" → "12 usuarios"). */
  itemLabel?: string;
}

const THEME = {
  light: {
    wrapper: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100/50",
    divide: "divide-purple-100/30",
    head: "bg-linear-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 text-purple-700",
    headHover: "hover:bg-purple-100/50",
    body: "bg-white/50 divide-purple-100/30 text-gray-700",
    row: "hover:bg-purple-50/40",
    search: "bg-white border-purple-200/60 text-gray-800 placeholder:text-gray-400 focus:border-purple-500",
    chip: "bg-white text-gray-600 border-purple-200/60 hover:bg-purple-50",
    chipActive: "bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 text-white border-transparent shadow",
    muted: "text-gray-500",
    pageBtn: "border-purple-200/60 text-gray-600 hover:bg-purple-50 disabled:opacity-40",
    pageActive: "bg-purple-600 text-white border-purple-600",
    bulk: "bg-linear-to-r from-purple-50/90 via-violet-50/90 to-pink-50/90 border-purple-200/50 text-purple-800",
    checkbox: "text-purple-600 border-purple-300 focus:ring-purple-500",
  },
  dark: {
    wrapper: "rounded-2xl border border-slate-700 bg-slate-800/60 overflow-hidden",
    divide: "divide-slate-700/60",
    head: "bg-slate-800 text-slate-400",
    headHover: "hover:bg-slate-700/50",
    body: "divide-slate-700/60 text-slate-200",
    row: "hover:bg-slate-700/30",
    search: "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-purple-500",
    chip: "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700",
    chipActive: "bg-purple-600 text-white border-purple-600",
    muted: "text-slate-400",
    pageBtn: "border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40",
    pageActive: "bg-purple-600 text-white border-purple-600",
    bulk: "bg-slate-800 border-slate-700 text-slate-100",
    checkbox: "text-purple-600 border-slate-600 focus:ring-purple-500",
  },
} as const;

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" } as const;

function pageWindow(page: number, totalPages: number, size = 5) {
  const half = Math.floor(size / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  variant = "light",
  searchPlaceholder = "Buscar...",
  getSearchText,
  filters,
  pageSize = 10,
  isLoading = false,
  emptyMessage = "No hay resultados.",
  toolbar,
  selectable = false,
  bulkActions,
  initialSort,
  rowClassName,
  server,
  itemLabel = "elemento",
}: DataTableProps<T>) {
  const t = THEME[variant];
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(filters?.[0]?.value ?? "");
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  // Debounce del buscador (evita filtrar/consultar en cada tecla)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (server?.onSearchChange) server.onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Modo cliente: filtrar → ordenar
  const processed = useMemo(() => {
    if (server) return data;

    let rows = data;
    const filter = filters?.find((f) => f.value === activeFilter);
    if (filter) rows = rows.filter(filter.predicate);

    const term = debouncedSearch.trim().toLowerCase();
    if (term && getSearchText) rows = rows.filter((r) => getSearchText(r).toLowerCase().includes(term));

    const column = sort ? columns.find((c) => c.key === sort.key) : undefined;
    if (column?.sortValue && sort) {
      const dir = sort.direction === "asc" ? 1 : -1;
      const value = column.sortValue;
      rows = [...rows].sort((a, b) => {
        const va = value(a);
        const vb = value(b);
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
        return String(va).localeCompare(String(vb), "es", { sensitivity: "base" }) * dir;
      });
    }
    return rows;
  }, [data, filters, activeFilter, debouncedSearch, getSearchText, sort, columns, server]);

  const totalCount = server ? server.totalCount : processed.length;
  const totalPages = server ? server.totalPages : Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = server ? server.page : Math.min(page, totalPages);
  const pageRows = server ? processed : processed.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goTo = (next: number) => {
    const clamped = Math.max(1, Math.min(next, totalPages));
    if (server) server.onPageChange(clamped);
    else setPage(clamped);
  };

  const toggleSort = (key: string) => {
    setPage(1);
    setSort((prev) => (prev?.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" }));
  };

  const allSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(getRowId(r)));
  const toggleAll = () =>
    setSelected(allSelected ? [] : pageRows.map(getRowId));
  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const selectedRows = data.filter((r) => selected.includes(getRowId(r)));
  const showSearch = Boolean(getSearchText) || Boolean(server?.onSearchChange);

  return (
    <div className="space-y-4">
      {(showSearch || filters || toolbar) && (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          {showSearch && (
            <div className="relative flex-1">
              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2", t.muted)} size={18} aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className={cn("w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none transition", t.search)}
              />
            </div>
          )}

          {filters && filters.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    setActiveFilter(f.value);
                    setPage(1);
                  }}
                  aria-pressed={activeFilter === f.value}
                  className={cn("px-4 py-2 rounded-xl border text-sm font-medium transition", activeFilter === f.value ? t.chipActive : t.chip)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {toolbar}
        </div>
      )}

      <div className={t.wrapper}>
        {selectable && selected.length > 0 && bulkActions && (
          <div className={cn("flex items-center justify-between px-6 py-3 border-b", t.bulk)}>
            <span className="text-sm font-semibold">
              {selected.length} seleccionado{selected.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">{bulkActions(selectedRows, () => setSelected([]))}</div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className={cn("min-w-full divide-y", t.divide)}>
            <thead className={t.head}>
              <tr>
                {selectable && (
                  <th scope="col" className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Seleccionar todos"
                      className={cn("h-4 w-4 rounded", t.checkbox)}
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const sortable = Boolean(col.sortValue) && !server;
                  const active = sort?.key === col.key;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={active ? (sort?.direction === "asc" ? "ascending" : "descending") : undefined}
                      className={cn("px-6 py-4 text-xs font-semibold uppercase tracking-wider", ALIGN[col.align ?? "left"], col.className)}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key)}
                          className={cn("inline-flex items-center gap-1 rounded -mx-1 px-1 uppercase", t.headHover)}
                        >
                          {col.header}
                          {active && (sort?.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className={cn("divide-y", t.body)}>
              {isLoading && (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className={cn("px-6 py-12 text-center animate-pulse", t.muted)}>
                    Cargando...
                  </td>
                </tr>
              )}
              {!isLoading && pageRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className={cn("px-6 py-12 text-center", t.muted)}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
              {!isLoading &&
                pageRows.map((row) => {
                  const id = getRowId(row);
                  return (
                    <tr key={id} className={cn("transition-colors", t.row, rowClassName?.(row))}>
                      {selectable && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(id)}
                            onChange={() => toggleOne(id)}
                            aria-label="Seleccionar fila"
                            className={cn("h-4 w-4 rounded", t.checkbox)}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={cn("px-6 py-4 text-sm align-middle", ALIGN[col.align ?? "left"], col.className)}>
                          {col.cell(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-sm", t.divide.replace("divide-", "border-"), t.muted)}>
          <span>
            {totalCount} {itemLabel}
            {totalCount !== 1 ? "s" : ""} · página {currentPage} de {totalPages}
          </span>
          {totalPages > 1 && (
            <nav className="flex items-center gap-1" aria-label="Paginación">
              <button
                type="button"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className={cn("p-2 rounded-lg border", t.pageBtn)}
              >
                <ChevronLeft size={16} />
              </button>
              {pageWindow(currentPage, totalPages).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goTo(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={cn("min-w-9 px-2 py-1.5 rounded-lg border", p === currentPage ? t.pageActive : t.pageBtn)}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className={cn("p-2 rounded-lg border", t.pageBtn)}
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
