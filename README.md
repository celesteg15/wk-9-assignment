# A6 — Faceted Browse Extension + State Model Notes

## How to run
Run the app from the project folder with:

`python3 -m http.server 5500`

Then open:

`http://127.0.0.1:5500/`

## Base state
The app stores these base state values:
- `query`
- `sortBy`
- `activeKind`
- `showFavoritesOnly`
- `selectedId`
- `favorites`
- `items`
- `isLoading`
- `error`
- `lastLoadedAt`

## Derived values
The app computes these derived values instead of storing duplicate arrays:
- filtered items
- sorted visible items
- selected visible item
- facet counts by kind
- active summary text
- visible count text
- empty-state message

## Selectors/helpers added
- `formatTime(date)`: formats the time shown in the status message after items load.
- `isValidItem(item)`: checks that each item has the right fields before the app uses it.
- `compareBy(sortBy)`: gives back the sorting function based on the current sort option.
- `getFilteredItems()`: filters the items using the search text, selected kind, and favorites-only toggle.
- `getSortedItems(filteredItems)`: sorts the filtered items without changing the original array.
- `getVisibleItems()`: returns the final list of items that should appear in the UI.
- `getSelectedVisibleItem(visibleItems)`: returns the selected item only if it is still in the visible list.
- `getKindCounts(items)`: uses reduce() to count how many items belong to each kind.
- `getActiveSummary(visibleItems)`: creates the summary text based on the current filters and results.
- `clearFilters()`: resets the browse controls to their default settings.

## Composition
My selector pipeline demonstrates function composition because each helper uses the output of the previous helper as its input. The app starts with the base `items` array, filters it with `getFilteredItems()`, sorts that result with `getSortedItems()`, and then uses the visible items to derive the selected item, counts, and summary text. This keeps the data flow predictable and avoids storing duplicate filtered or sorted arrays in state.