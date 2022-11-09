import { useEffect, useLayoutEffect } from 'react';
import { generateJSON } from '@tiptap/html';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import MentionsExtension from './components/Mentions';
import traverse from 'traverse';
export const getMentionedUserIds = (doc) => {
    const userIds = [];
    const json = generateJSON(doc, [
        StarterKit,
        Placeholder,
        MentionsExtension,
        CodeBlockLowlight,
        Link,
    ]);
    traverse(json).forEach(function (node) {
        if ((node === null || node === void 0 ? void 0 : node.type) === 'mention') {
            userIds.push(node.attrs.id);
        }
    });
    return userIds;
};
export const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const useIsomorphicEffect = () => {
    return typeof window !== 'undefined' ? useLayoutEffect : useEffect;
};
