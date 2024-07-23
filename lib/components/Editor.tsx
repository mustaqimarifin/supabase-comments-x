/* eslint-disable no-alert */
import { forwardRef, useCallback, useImperativeHandle } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Editor as IEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { cx } from '../utils.js'
import MentionsExtension from './Mentions.js'
import { useCommentsContext } from './CommentsProvider.js'
import { BoldIcon, CodeIcon, ImageIcon, ItalicIcon } from '../Icons.js'

export interface EditorProps {
  defaultValue: string
  onChange?: (value: string) => void
  readOnly?: boolean
  autoFocus?: boolean
  actions?: any
  ref?: any
}

export interface EditorRefHandle {
  editor: () => IEditor | null
}

const Editor = forwardRef(
  ({ defaultValue, onChange, readOnly = false, autoFocus = false, actions = null }: EditorProps, ref) => {
    const context = useCommentsContext()
    const extensions = [
      Image,
      StarterKit,
      Link.configure({
        HTMLAttributes: {
          class: 'tiptap-link',
        },
        openOnClick: false,
      }),
    ]
    if (context.enableMentions) {
      extensions.push(MentionsExtension)
    }
    const editor = useEditor({
      editable: !readOnly,
      extensions,
      content: defaultValue,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML())
      },
      immediatelyRender: false,
      autofocus: autoFocus ? 'end' : false,
      editorProps: {
        attributes: {
          class: 'tiptap-editor',
        },
      },
    })

    useImperativeHandle(ref, () => ({
      editor: () => {
        return editor
      },
    }))
    const activeStyles = 'bg-alpha-10'
    const addImage = useCallback(() => {
      const url = window.prompt('URL')
      if (url) {
        editor?.chain().focus().setImage({ src: url }).run()
      }
    }, [editor])

    if (!editor) {
      return null
    }

    return (
      <div className={cx(readOnly ? 'viewer' : 'editor', 'tiptap-editor text-alpha-80 border-alpha-10 rounded-md')}>
        <EditorContent className={cx('h-full', readOnly ? null : 'pb-8')} editor={editor} />
        {!readOnly && (
          <div className="border-t-2 border-alpha-10 absolute bottom-0 left-0 right-0 flex items-center h-8 z-10 border-alpha-10">
            <div
              className="grid w-8 h-full place-items-center cursor-pointer"
              onMouseDown={(e) => {
                editor?.chain().focus().toggleBold().run()
                e.preventDefault()
              }}
              title="Bold">
              <BoldIcon
                className={cx('h-6 w-6 p-1.5 font-bold rounded-full', editor?.isActive('bold') && activeStyles)}
              />
            </div>
            <div
              className="grid w-8 h-full place-items-center cursor-pointer"
              onMouseDown={(e) => {
                editor?.chain().focus().toggleItalic().run()
                e.preventDefault()
              }}
              title="Italic">
              <ItalicIcon
                className={cx('h-6 w-6 p-1.5 font-bold rounded-full', editor?.isActive('italic') && activeStyles)}
              />
            </div>
            <div
              className="grid w-8 h-full place-items-center cursor-pointer"
              onMouseDown={addImage}
              title="Upload Image">
              <ImageIcon
                className={cx('h-6 w-6 p-1.5 font-bold rounded-full', editor?.isActive('image') && activeStyles)}
              />
            </div>
            <div
              className="grid w-8 h-full place-items-center cursor-pointer"
              onMouseDown={(e) => {
                editor?.chain().focus().toggleCodeBlock().run()
                e.preventDefault()
              }}
              title="Code Block">
              <CodeIcon
                className={cx('h-6 w-6 p-1.5 font-bold rounded-full', editor?.isActive('codeBlock') && activeStyles)}
              />
            </div>
            <div className="flex-1" />
            <div>{actions}</div>
          </div>
        )}
      </div>
    )
  }
)

export default Editor
