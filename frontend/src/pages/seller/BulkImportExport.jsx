import React, { useState } from 'react';
import {
    Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle,
    Loader2, ArrowRight, FileText, Database, Settings, X
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

const IMPORT_HISTORY = [
    { id: 1, filename: 'products_april_batch.csv', records: 342, status: 'completed', date: '2026-04-28', errors: 0 },
    { id: 2, filename: 'inventory_update.xlsx', records: 128, status: 'completed', date: '2026-04-25', errors: 3 },
    { id: 3, filename: 'customer_list.csv', records: 1500, status: 'completed', date: '2026-04-20', errors: 12 },
];

const EXPORT_OPTIONS = [
    { key: 'products', label: 'Products', description: 'All product data including variants, images, and metadata', icon: '📦', records: 156 },
    { key: 'orders', label: 'Orders', description: 'Complete order history with line items and customer info', icon: '🛒', records: 2341 },
    { key: 'customers', label: 'Customers', description: 'Customer profiles, purchase history, and contact info', icon: '👥', records: 892 },
    { key: 'inventory', label: 'Inventory', description: 'Current stock levels, SKUs, and warehouse locations', icon: '📊', records: 156 },
];

const FIELD_MAPPINGS = [
    { source: 'product_name', target: 'title', mapped: true },
    { source: 'description_html', target: 'body_html', mapped: true },
    { source: 'price_usd', target: 'price', mapped: true },
    { source: 'stock_qty', target: 'inventory_quantity', mapped: true },
    { source: 'img_url', target: 'image_src', mapped: true },
    { source: 'cat', target: 'category', mapped: false },
    { source: 'sku_code', target: 'sku', mapped: true },
];

export default function BulkImportExport() {
    const { canAccess, currentPlan } = useSubscription();
    const [activeTab, setActiveTab] = useState('import');
    const [dragOver, setDragOver] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    if (!canAccess('import')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature="Advanced Bulk Import/Export"
                    requiredPlan="enterprise"
                    message="Import and export massive datasets with custom field mapping. Perfect for migrating stores or syncing with external systems."
                    variant="card"
                />
            </div>
        );
    }

    const handleMockImport = () => {
        setImporting(true);
        setImportProgress(0);
        const interval = setInterval(() => {
            setImportProgress(prev => {
                if (prev >= 100) { clearInterval(interval); setImporting(false); return 100; }
                return prev + 10;
            });
        }, 300);
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Bulk Import / Export</h2>
                <p className="text-text-muted text-sm mt-1">
                    Import and export large datasets with custom field mapping
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
                {[
                    { key: 'import', label: 'Import', icon: Upload },
                    { key: 'export', label: 'Export', icon: Download },
                    { key: 'mapping', label: 'Field Mapping', icon: Settings },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'text-text-muted hover:bg-surface-bg'
                        }`}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Import Tab */}
            {activeTab === 'import' && (
                <div className="space-y-5">
                    {/* Drop Zone */}
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                            dragOver ? 'border-brand-primary bg-brand-primary/5' : 'border-border-soft bg-white hover:border-gray-300'
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleMockImport(); }}
                    >
                        <Upload size={32} className="mx-auto text-text-muted/40 mb-3" />
                        <p className="text-sm font-medium text-text-primary mb-1">
                            Drop your CSV or XLSX file here
                        </p>
                        <p className="text-xs text-text-muted mb-4">
                            Supports CSV, XLSX, and JSON formats. Max 50MB per file.
                        </p>
                        <button
                            onClick={handleMockImport}
                            className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                        >
                            Browse Files
                        </button>
                    </div>

                    {/* Progress */}
                    {importing && (
                        <div className="bg-white rounded-2xl border border-border-soft p-5 animate-fade-in">
                            <div className="flex items-center gap-3 mb-3">
                                <Loader2 size={16} className="text-brand-primary animate-spin" />
                                <p className="text-sm font-semibold text-text-primary">Importing data...</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${importProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-text-muted mt-2">{importProgress}% complete</p>
                        </div>
                    )}

                    {/* Import History */}
                    <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                        <div className="px-5 py-3 border-b border-border-soft">
                            <h3 className="text-sm font-semibold text-text-primary">Import History</h3>
                        </div>
                        <div className="divide-y divide-border-soft">
                            {IMPORT_HISTORY.map(item => (
                                <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-bg/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet size={16} className="text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{item.filename}</p>
                                            <p className="text-xs text-text-muted">{item.records} records • {item.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {item.errors > 0 && (
                                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                                {item.errors} errors
                                            </span>
                                        )}
                                        <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <CheckCircle size={10} />Completed
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXPORT_OPTIONS.map(option => (
                        <div key={option.key} className="bg-white rounded-2xl border border-border-soft p-5 hover:border-gray-300 transition-colors">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">{option.icon}</span>
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary">{option.label}</h4>
                                    <p className="text-xs text-text-muted mt-0.5">{option.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-text-muted">{option.records.toLocaleString()} records</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 text-xs font-semibold text-text-primary bg-surface-bg rounded-lg hover:bg-gray-200 transition-colors">
                                        CSV
                                    </button>
                                    <button className="px-3 py-1.5 text-xs font-semibold text-text-primary bg-surface-bg rounded-lg hover:bg-gray-200 transition-colors">
                                        XLSX
                                    </button>
                                    <button className="px-3 py-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/5 rounded-lg hover:bg-brand-primary/10 transition-colors">
                                        JSON
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Field Mapping Tab */}
            {activeTab === 'mapping' && (
                <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                    <div className="px-5 py-3 border-b border-border-soft flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-text-primary">Custom Field Mapping</h3>
                        <button className="px-3 py-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-lg transition-colors">
                            Save Mapping
                        </button>
                    </div>
                    <p className="px-5 pt-3 text-xs text-text-muted">
                        Map your CSV/XLSX column headers to Toroongo's product fields. Saved mappings are reused for future imports.
                    </p>
                    <table className="w-full mt-3">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-2.5 text-xs font-medium text-text-muted uppercase">Source Column</th>
                                <th className="px-5 py-2.5 text-xs font-medium text-text-muted uppercase text-center">→</th>
                                <th className="px-5 py-2.5 text-xs font-medium text-text-muted uppercase">Toroongo Field</th>
                                <th className="px-5 py-2.5 text-xs font-medium text-text-muted uppercase text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {FIELD_MAPPINGS.map((mapping, idx) => (
                                <tr key={idx} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3">
                                        <code className="text-xs font-mono text-text-primary bg-surface-bg px-2 py-0.5 rounded">{mapping.source}</code>
                                    </td>
                                    <td className="px-5 py-3 text-center"><ArrowRight size={14} className="text-text-muted mx-auto" /></td>
                                    <td className="px-5 py-3">
                                        <code className="text-xs font-mono text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded">{mapping.target}</code>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        {mapping.mapped
                                            ? <CheckCircle size={14} className="text-green-500 mx-auto" />
                                            : <AlertCircle size={14} className="text-amber-500 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
