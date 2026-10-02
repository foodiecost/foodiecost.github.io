import * as React from 'react'

/** Filters a list by a text query, matched against `getText(item)` using Bulgarian locale rules. */
export function useSearch<T>(list: T[], getText: (item: T) => string) {
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLocaleLowerCase('bg')
    return q ? list.filter((item) => getText(item).toLocaleLowerCase('bg').includes(q)) : list
  }, [list, query, getText])

  return { query, setQuery, filtered }
}
