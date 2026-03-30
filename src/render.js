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
import { formatTime, getActiveSummary, getKindCounts, getSelectedVisibleItem, getVisibleItems, state } from "./state.js";

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
function renderControls(kindCounts) {
  searchInput.value = state.query;
  sortSelect.value = state.sortBy;
  favFilterBtn.setAttribute("aria-pressed", state.showFavoritesOnly ? "true" : "false");
  clearBtn.disabled = !state.query && state.activeKind === "all" && !state.showFavoritesOnly && state.sortBy === "title-asc";

  kindChips.replaceChildren();
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "chip";
  if (state.activeKind === "all") allButton.classList.add("is-active");
  allButton.dataset.kind = "all";

  const allLabel = document.createElement("span");
  allLabel.textContent = "All";

  const allCount = document.createElement("span");
  allCount.className = "chip-count";
  allCount.textContent = state.items.length;

  allButton.append(allLabel, allCount);
  kindChips.appendChild(allButton);

  for (const [kind, count] of Object.entries(kindCounts).sort((a, b) => a[0].localeCompare(b[0]))) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    if (state.activeKind === kind) button.classList.add("is-active");
    button.dataset.kind = kind;

    const label = document.createElement("span");
    label.textContent = kind;

    const countBadge = document.createElement("span");
    countBadge.className = "chip-count";
    countBadge.textContent = count;

    button.append(label, countBadge);
    kindChips.appendChild(button);
  }
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
  if (!state.selectedId) {
    detailHint.textContent = "Select an item to show detail.";
    detailTitle.textContent = "Nothing selected";
    detailMeta.textContent = "—";
    detailDesc.textContent = "Choose an item from the list to view its details.";
    favBtn.disabled = true;
    favBtn.setAttribute("aria-pressed", "false");
    favBtn.textContent = "Favorite";
    return;
  }

  if (!selectedItem) {
    detailHint.textContent = "Current filters hide the selected item.";
    detailTitle.textContent = "Selected item hidden";
    detailMeta.textContent = "—";
    detailDesc.textContent = "Clear filters or select another visible item from the list.";
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
    summaryEl.textContent = getActiveSummary(visibleItems);

    emptyEl.hidden = state.error || state.isLoading || visibleItems.length !== 0;

    if (state.query || state.activeKind !== "all" || state.showFavoritesOnly) {
      emptyMsgEl.textContent = "No items match the current search and filter settings.";
    } else {
      emptyMsgEl.textContent = "No items are available right now.";
    }

    reloadBtn.disabled = state.isLoading;
    retryBtn.disabled = state.isLoading;
}

export { render };