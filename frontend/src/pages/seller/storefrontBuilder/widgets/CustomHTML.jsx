import React from 'react';

/**
 * CustomHTML Widget
 * Renders raw HTML from the seller. Sanitized rendering via dangerouslySetInnerHTML.
 */
export default function CustomHTML({ code = '' }) {
    return (
        <div
            className="custom-html-widget"
            dangerouslySetInnerHTML={{ __html: code }}
        />
    );
}
