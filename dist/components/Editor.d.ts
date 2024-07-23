import type { Editor as IEditor } from '@tiptap/react';
export interface EditorProps {
    defaultValue: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    autoFocus?: boolean;
    actions?: any;
    ref?: any;
}
export interface EditorRefHandle {
    editor: () => IEditor | null;
}
declare const Editor: import("react").ForwardRefExoticComponent<Omit<EditorProps, "ref"> & import("react").RefAttributes<unknown>>;
export default Editor;
