import * as React from 'react';
/**
 * React hook to persist any value between renders,
 * but keeps it up-to-date if it changes.
 *
 * @param value the value or function to persist
 */
export function useLatestRef(value) {
    const ref = React.useRef(null);
    ref.current = value;
    return ref;
}
