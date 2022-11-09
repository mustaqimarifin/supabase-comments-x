export declare const suggestionConfig: {
    items: () => never[];
    render: () => {
        onStart: (props: any) => void;
        onUpdate(props: any): void;
        onKeyDown(props: any): any;
        onExit(): void;
    };
};
declare const MentionsExtension: import("@tiptap/react").Node<import("@tiptap/extension-mention").MentionOptions, any>;
export default MentionsExtension;
