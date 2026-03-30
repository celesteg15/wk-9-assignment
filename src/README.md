# A6 — Faceted Browse Extension + State Model Notes

## How to run
Run the app from the project folder with:

`python3 -m http.server 4040`

Then open:

`http://127.0.0.1:4040/`

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
- `formatTime(date)`: formats the last loaded time for the status text.
- `isValidItem(item)`: checks whether a loaded item has the expected structure.
- `compareBy(sortBy)`: returns the comparator function used for sorting.
- `getFilteredItems()`: filters items by search query, kind, and favorites-only.
- `getSortedItems(filteredItems)`: sorts the filtered items without mutating the original array.
- `getVisibleItems()`: returns the final visible items shown in the UI.
- `getSelectedVisibleItem(visibleItems)`: returns the selected item only if it is still visible.
- `getKindCounts(items)`: uses `reduce()` to compute facet counts by kind.
- `getActiveSummary(visibleItems)`: builds summary text from the current controls.
- `clearFilters()`: resets the browse controls back to their default values.

## Composition
My selector pipeline demonstrates function composition because each step uses the output of the previous step. The app starts with the base `items` array, filters it with `getFilteredItems()`, sorts that result with `getSortedItems()`, and then uses the visible items to derive the selected item, counts, and summary text. This keeps the data flow predictable and avoids storing duplicate filtered or sorted arrays in state.