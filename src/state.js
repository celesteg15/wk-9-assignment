const DATA_URL = "./assets/items.json";

const state = {
  query: "",
  sortBy: "title-asc",
  activeKind: "all",
  showFavoritesOnly: false,
  selectedId: null,
  favorites: new Set(["echo"]),
  items: [],
  isLoading: false,
  error: null,
  lastLoadedAt: null,
};

function formatTime(date) {
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isValidItem(item) {
  return (
    item
    && typeof item === "object"
    && typeof item.id === "string"
    && typeof item.title === "string"
    && typeof item.kind === "string"
    && typeof item.minutes === "number"
    && typeof item.desc === "string"
    && Array.isArray(item.tags)
  );
}

function compareBy(sortBy) {
  if (sortBy === "minutes-desc") {
    return (a, b) => b.minutes - a.minutes;
  }

  if (sortBy === "kind-asc") {
    return (a, b) => a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title);
  }

  return (a, b) => a.title.localeCompare(b.title);
}

function getFilteredItems() {
  const normalizedQuery = state.query.trim().toLowerCase();

  return state.items.filter((item) => {
    const matchesQuery = normalizedQuery === ""
      || item.title.toLowerCase().includes(normalizedQuery)
      || item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesFavorites = !state.showFavoritesOnly || state.favorites.has(item.id);

    // Week 9 TODO: also filter by state.activeKind.
    return matchesQuery && matchesFavorites;
  });
}

function getVisibleItems() {
  return [...getFilteredItems()].sort(compareBy(state.sortBy));
}

function getSelectedVisibleItem(visibleItems) {
  return visibleItems.find((item) => item.id === state.selectedId) ?? null;
}

function getKindCounts(items) {
  // Week 9 TODO: replace this placeholder with a reduce() summary over items.
  return {};
}

function clearFilters() {
  state.query = "";
  state.sortBy = "title-asc";
  state.activeKind = "all";
  state.showFavoritesOnly = false;
}

export {
  DATA_URL,
  clearFilters,
  formatTime,
  getKindCounts,
  getSelectedVisibleItem,
  getVisibleItems,
  isValidItem,
  state,
};