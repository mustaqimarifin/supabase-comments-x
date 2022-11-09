import { FC, ReactNode } from 'react';
import { Editor as IEditor } from '@tiptap/core';
interface EditorProps {
    defaultValue: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    autoFocus?: boolean;
    actions?: ReactNode;
    ref?: any;
}
export interface EditorRefHandle {
    editor: () => IEditor | null;
}
declare const Editor: FC<EditorProps>;
export default Editor;
