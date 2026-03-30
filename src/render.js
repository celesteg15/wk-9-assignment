import {
  clearBtn,
  countsEl,
  detailDesc,
  detailHint,
  detailMeta,
  detailTitle,
  emptyEl,
  emptyMsgEl,
  errorEl,
  errorMsgEl,
  favBtn,
  favFilterBtn,
  grid,
  kindChips,
  reloadBtn,
  retryBtn,
  searchInput,
  sortSelect,
  statusEl,
  summaryEl,
} from "./dom.js";
import { formatTime, getKindCounts, getSelectedVisibleItem, getVisibleItems, state } from "./state.js";

function renderStatus() {
  if (state.isLoading) {
    statusEl.textContent = "Loading data…";
    return;
  }

  if (state.error) {
    statusEl.textContent = "";
    return;
  }

  statusEl.textContent = state.lastLoadedAt
    ? `Loaded ${state.items.length} items at ${formatTime(state.lastLoadedAt)}.`
    : "";
}

function renderError() {
  errorEl.hidden = !state.error;
  errorMsgEl.textContent = state.error || "—";
}

// Week 9 TODO: accept kindCounts as a parameter and use it to render real chips below.
function renderControls() {
  searchInput.value = state.query;
  sortSelect.value = state.sortBy;
  favFilterBtn.setAttribute("aria-pressed", state.showFavoritesOnly ? "true" : "false");
  clearBtn.disabled = !state.query && state.activeKind === "all" && !state.showFavoritesOnly && state.sortBy === "title-asc";

  kindChips.replaceChildren();
  const placeholder = document.createElement("div");
  placeholder.className = "chip";
  placeholder.textContent = "TODO: render facet chips with reduce() counts";
  kindChips.appendChild(placeholder);
}

function renderList(visibleItems) {
  grid.replaceChildren();

  for (const item of visibleItems) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.id = item.id;
    if (item.id === state.selectedId) button.classList.add("is-selected");

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = `${item.kind} • ${item.minutes} min • ${item.tags.join(", ")}`;

    button.append(title, meta);
    grid.appendChild(button);
  }
}

// Week 9 TODO: handle the case where selectedId is set but the item is hidden by filters.
function renderDetail(selectedItem) {
  if (!selectedItem) {
    detailHint.textContent = "Select an item to show detail.";
    detailTitle.textContent = "Nothing selected";
    detailMeta.textContent = "—";
    detailDesc.textContent = "Week 9 TODO: decide your selection policy under filtering.";
    favBtn.disabled = true;
    favBtn.setAttribute("aria-pressed", "false");
    favBtn.textContent = "Favorite";
    return;
  }

  detailHint.textContent = "";
  detailTitle.textContent = selectedItem.title;
  detailMeta.textContent = `${selectedItem.kind} • ${selectedItem.minutes} min`;
  detailDesc.textContent = selectedItem.desc;

  const isFavorite = state.favorites.has(selectedItem.id);
  favBtn.disabled = false;
  favBtn.setAttribute("aria-pressed", isFavorite ? "true" : "false");
  favBtn.textContent = isFavorite ? "Unfavorite" : "Favorite";
}

function render() {
  const visibleItems = getVisibleItems();
  const selectedItem = getSelectedVisibleItem(visibleItems);

  renderStatus();
  renderError();
  renderControls(getKindCounts(state.items));
  renderList(visibleItems);
  renderDetail(selectedItem);

  countsEl.textContent = `${visibleItems.length} shown • ${state.items.length} total`;
  summaryEl.textContent = "TODO: derive active summary from query, sort, facet, and visible count.";

  emptyEl.hidden = state.error || state.isLoading || visibleItems.length !== 0;
  emptyMsgEl.textContent = "TODO: explain active filters when there are no results.";

  reloadBtn.disabled = state.isLoading;
  retryBtn.disabled = state.isLoading;
}

export { render };