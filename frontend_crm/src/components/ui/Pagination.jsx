import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    className = "" 
}) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisible - 1);
            
            if (end === totalPages) {
                start = Math.max(1, end - maxVisible + 1);
            }
            
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className={`flex items-center justify-between px-4 py-3 bg-white border-t border-border-soft sm:px-6 ${className}`}>
            <div className="flex justify-between flex-1 sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-text-muted">
                        Page <span className="font-semibold text-text-primary">{currentPage}</span> of{' '}
                        <span className="font-semibold text-text-primary">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-soft bg-white text-sm font-medium text-text-muted hover:bg-surface-bg disabled:opacity-30"
                        >
                            <span className="sr-only">First</span>
                            <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 border border-border-soft bg-white text-sm font-medium text-text-muted hover:bg-surface-bg disabled:opacity-30"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-bold transition-all
                                    ${currentPage === page
                                        ? 'z-10 bg-brand-primary border-brand-primary text-white scale-105'
                                        : 'bg-white border-border-soft text-text-muted hover:bg-surface-bg hover:text-text-primary'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 border border-border-soft bg-white text-sm font-medium text-text-muted hover:bg-surface-bg disabled:opacity-30"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-soft bg-white text-sm font-medium text-text-muted hover:bg-surface-bg disabled:opacity-30"
                        >
                            <span className="sr-only">Last</span>
                            <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
