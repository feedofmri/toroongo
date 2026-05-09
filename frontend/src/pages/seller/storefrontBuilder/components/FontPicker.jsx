import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { GOOGLE_FONTS, FONT_CATEGORIES, loadFontPreviews } from '../data/fontData';

export default function FontPicker({ label, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const searchRef = useRef(null);
    const listRef = useRef(null);

    // Load preview fonts once when the picker first opens
    useEffect(() => {
        if (open) {
            loadFontPreviews();
            // Auto-focus search after transition
            setTimeout(() => searchRef.current?.focus(), 50);
            // Scroll selected font into view
            setTimeout(() => {
                const el = listRef.current?.querySelector('[data-selected="true"]');
                el?.scrollIntoView({ block: 'center' });
            }, 80);
        } else {
            setSearch('');
        }
    }, [open]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return GOOGLE_FONTS.filter((f) => {
            const matchCat = category === 'All' || f.category === category;
            const matchSearch = !q || f.name.toLowerCase().includes(q);
            return matchCat && matchSearch;
        });
    }, [search, category]);

    return (
        <div>
            <span className="text-xs font-medium text-gray-500 block mb-1.5">{label}</span>

            {/* Trigger button — shows current font in its own typeface */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-sm text-left shadow-sm"
                style={{ fontFamily: `'${value}', sans-serif` }}
            >
                <span className="truncate text-gray-800">{value}</span>
                {open
                    ? <ChevronUp size={13} className="shrink-0 text-gray-400 ml-2" />
                    : <ChevronDown size={13} className="shrink-0 text-gray-400 ml-2" />
                }
            </button>

            {/* Inline dropdown panel */}
            {open && (
                <div className="mt-1.5 border border-gray-200 rounded-xl bg-white shadow-xl overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search fonts…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-brand-primary transition-colors bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-1 px-2 py-1.5 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                        {FONT_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg whitespace-nowrap transition-colors ${
                                    category === cat
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Font count */}
                    <div className="px-3 py-1 border-b border-gray-50 bg-gray-50">
                        <span className="text-[10px] text-gray-400">
                            {filtered.length} font{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Font list */}
                    <div ref={listRef} className="overflow-y-auto max-h-60">
                        {filtered.length === 0 ? (
                            <div className="py-6 text-center">
                                <p className="text-xs text-gray-400">No fonts found for "{search}"</p>
                            </div>
                        ) : (
                            filtered.map((font) => {
                                const isSelected = value === font.name;
                                return (
                                    <button
                                        key={font.name}
                                        type="button"
                                        data-selected={isSelected}
                                        onClick={() => {
                                            onChange(font.name);
                                            setOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2 ${
                                            isSelected
                                                ? 'bg-brand-primary/8 text-brand-primary'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                        style={{ fontFamily: `'${font.name}', sans-serif` }}
                                    >
                                        <span className="truncate">{font.name}</span>
                                        {isSelected && (
                                            <Check size={12} className="shrink-0 text-brand-primary" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer with preview */}
                    <div
                        className="border-t border-gray-100 px-3 py-2.5 bg-gray-50 flex items-center justify-between gap-3"
                    >
                        <span className="text-[10px] text-gray-400 shrink-0">Preview</span>
                        <span
                            className="text-sm text-gray-700 truncate"
                            style={{ fontFamily: `'${value}', sans-serif` }}
                        >
                            The quick brown fox jumps
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
