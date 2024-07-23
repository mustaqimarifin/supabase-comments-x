import React, { useInsertionEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { generateJSON } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import tinycolor from 'tinycolor2'
import traverse from 'traverse'
import MentionsExtension from './components/Mentions.js'

export function getMentions(doc: string): string[] {
  const userIds: string[] = []
  const json = generateJSON(doc, [StarterKit, MentionsExtension, Link])

  traverse(json).forEach((node) => {
    if (node.type === 'mention') {
      userIds.push(node.attrs.id)
    }
  })

  return userIds
}

/**
 * less annoying useLayoutEffect
 */
const useLayoutEffect = globalThis?.document ? React.useLayoutEffect : () => {}

export { useLayoutEffect }

export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined
export type ClassDictionary = Record<string, any>
export type ClassArray = ClassValue[]
export const cx = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ')

export function timeAgo(d: string) {
  let t = d
  const currentDate = new Date()
  if (!t.includes('T')) {
    t = `${d}T00:00:00`
  }
  const targetDate = new Date(d)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDay() - targetDate.getDay()
  const hoursAgo = currentDate.getHours() - targetDate.getHours()
  const minAgo = currentDate.getMinutes() - targetDate.getMinutes()
  const secAgo = currentDate.getSeconds() - targetDate.getSeconds()

  let shape = ''

  if (yearsAgo > 0) {
    shape = `${yearsAgo}y ago`
  }
  else if (monthsAgo > 0) {
    shape = `${monthsAgo}mo ago`
  }
  else if (daysAgo > 0) {
    shape = `${daysAgo}d ago`
  }
  else if (hoursAgo > 0) {
    shape = `${hoursAgo}h ago`
  }
  else if (minAgo > 0) {
    shape = `${minAgo}min ago`
  }
  else if (secAgo < 30) {
    shape = `${secAgo}sec ago`
  }
  else {
    shape = 'just now'
  }
  return shape
}

interface UseUncontrolledStateOptions<T> {
  defaultValue: T
}

// Enables updates to default value when using uncontrolled inputs
export function useUncontrolledState<T>(options: UseUncontrolledStateOptions<T>) {
  const [state, setState] = React.useState({
    defaultValue: options.defaultValue,
    value: options.defaultValue,
    key: 0,
  })

  const setValue = React.useCallback(
    (val: T) =>
      setState(prev => ({
        ...prev,
        value: val,
      })),
    [],
  )

  const setDefaultValue = React.useCallback(
    (defaultVal: T) =>
      setState(prev => ({
        key: prev.key + 1,
        value: defaultVal,
        defaultValue: defaultVal,
      })),
    [],
  )

  const resetValue = React.useCallback(
    () =>
      setState(prev => ({
        ...prev,
        value: prev.defaultValue,
        key: prev.key + 1,
      })),
    [],
  )

  useLayoutEffect(() => {
    setDefaultValue(options.defaultValue)
  }, [options.defaultValue, setDefaultValue])

  return React.useMemo(
    () => ({
      ...state,
      setValue,
      setDefaultValue,
      resetValue,
    }),
    [state, setValue, setDefaultValue, resetValue],
  )
}

function generatePalette(basecolor: string) {
  const color = tinycolor(basecolor).toHsl()
  const { h, s } = color

  return {
    50: tinycolor.fromRatio({ h, s, l: 0.95 }).toString(),
    100: tinycolor.fromRatio({ h, s, l: 0.85 }).toString(),
    200: tinycolor.fromRatio({ h, s, l: 0.75 }).toString(),
    300: tinycolor.fromRatio({ h, s, l: 0.65 }).toString(),
    400: tinycolor.fromRatio({ h, s, l: 0.55 }).toString(),
    500: tinycolor.fromRatio({ h, s, l: 0.45 }).toString(),
    600: tinycolor.fromRatio({ h, s, l: 0.35 }).toString(),
    700: tinycolor.fromRatio({ h, s, l: 0.25 }).toString(),
    800: tinycolor.fromRatio({ h, s, l: 0.15 }).toString(),
    900: tinycolor.fromRatio({ h, s, l: 0.5 }).toString(),
  }
}

export function useCssPalette(baseColor: string, variablePrefix: string) {
  useInsertionEffect(() => {
    const palette = generatePalette(baseColor)
    Object.entries(palette).map(([key, val]) => {
      return document.documentElement.style.setProperty(`--${variablePrefix}-${key}`, val)
    })
    return () => {
      Object.keys(palette).map((key) => {
        return document.documentElement.style.removeProperty(`--${variablePrefix}-${key}`)
      })
    }
  }, [baseColor, variablePrefix])
}
