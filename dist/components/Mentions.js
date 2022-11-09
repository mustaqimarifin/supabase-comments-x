import tippy from 'tippy.js';
import { ReactRenderer } from '@tiptap/react';
import React, { useState, useEffect, forwardRef, useImperativeHandle, } from 'react';
import { useSearchUsers } from '..';
import { Loading, Menu, Typography } from '@supabase/ui';
import Mention from '@tiptap/extension-mention';
import User from './User';
const MentionList = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const query = useSearchUsers({ search: props.query });
    useEffect(() => setSelectedIndex(0), [query.data]);
    const selectItem = (index) => {
        var _a;
        const item = (_a = query.data) === null || _a === void 0 ? void 0 : _a[index];
        if (item) {
            props.command({ id: item.id, label: item.name });
        }
    };
    const upHandler = () => {
        if (!query.data) {
            return;
        }
        setSelectedIndex((selectedIndex + query.data.length - 1) % query.data.length);
    };
    const downHandler = () => {
        if (!query.data) {
            return;
        }
        setSelectedIndex((selectedIndex + 1) % query.data.length);
    };
    const enterHandler = () => {
        selectItem(selectedIndex);
    };
    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }
            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }
            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }
            return false;
        },
    }));
    if (!props.editor.options.editable) {
        return null;
    }
    return (<Menu className="overflow-hidden rounded-lg dark:bg-neutral-800 bg-neutral-100">
      {query.isLoading && <Loading active>{null}</Loading>}
      {query.data &&
            query.data.length > 0 &&
            query.data.map((item, index) => (<Menu.Item active={selectedIndex === index} key={index} onClick={() => selectItem(index)}>
            <User key={item.id} id={item.id} size="sm" propagateClick={false}/>
          </Menu.Item>))}
      {query.data && query.data.length === 0 && (<div className="px-4 py-2">
          <Typography.Text>No results.</Typography.Text>
        </div>)}
    </Menu>);
});
export const suggestionConfig = {
    items: () => [],
    render: () => {
        let reactRenderer;
        let popup;
        return {
            onStart: (props) => {
                reactRenderer = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                });
                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: reactRenderer.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'top-start',
                });
            },
            onUpdate(props) {
                reactRenderer.updateProps(props);
                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },
            onKeyDown(props) {
                var _a;
                return (_a = reactRenderer.ref) === null || _a === void 0 ? void 0 : _a.onKeyDown(props);
            },
            onExit() {
                popup[0].destroy();
                reactRenderer.destroy();
            },
        };
    },
};
const MentionsExtension = Mention.configure({
    HTMLAttributes: {
        class: 'mention',
    },
    suggestion: suggestionConfig,
});
export default MentionsExtension;
