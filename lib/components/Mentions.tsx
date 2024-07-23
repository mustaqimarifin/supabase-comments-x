import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { type AnyExtension, ReactRenderer } from '@tiptap/react'
import { Loading, Menu, Typography } from 'supalazy'
import Mention from '@tiptap/extension-mention'
import tippy from 'tippy.js'
import { useSearchUsers } from '../hooks/index.js'
import { User } from './CommentSection.js'

const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const query = useSearchUsers({ search: props.query })

  useEffect(() => setSelectedIndex(0), [query.data])

  const selectItem = (index: number) => {
    const item = query.data?.[index]

    if (item) {
      props.command({ id: item.id, label: item.name })
    }
  }

  const upHandler = () => {
    if (!query.data) {
      return
    }
    setSelectedIndex((selectedIndex + query.data.length - 1) % query.data.length)
  }

  const downHandler = () => {
    if (!query.data) {
      return
    }
    setSelectedIndex((selectedIndex + 1) % query.data.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }
  useImperativeHandle(ref, () => ({
    // @ts-expect-error
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  if (!props.editor.options.editable) {
    return null
  }

  return (
    <Menu className="overflow-hidden rounded-lg dark:bg-neutral-800 bg-neutral-100">
      {query.isLoading && <Loading active>{null}</Loading>}
      {query.data &&
        query.data.length > 0 &&
        query.data.map((item: any, index: number) => (
          <Menu.Item active={selectedIndex === index} key={index} onClick={() => selectItem(index)}>
            <User key={item.id} id={item.id} size="sm" propagateClick={false} />
          </Menu.Item>
        ))}
      {query.data && query.data.length === 0 && (
        <div className="px-4 py-2">
          <Typography.Text>No results.</Typography.Text>
        </div>
      )}
    </Menu>
  )
})

const suggestionConfig = {
  // @ts-ignore
  items: () => [],
  render: () => {
    let reactRenderer: any
    let popup: any

    return {
      onStart: (props: any) => {
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })
        // @ts-ignore
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'top-start',
        })
      },
      onUpdate(props: any) {
        reactRenderer.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },
      onKeyDown(props: any) {
        return reactRenderer.ref?.onKeyDown(props)
      },
      onExit() {
        popup[0].destroy()
        reactRenderer.destroy()
      },
    }
  },
}

const MentionsExtension: AnyExtension = Mention.configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion: suggestionConfig,
})

export default MentionsExtension
