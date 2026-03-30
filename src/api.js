import { DATA_URL, isValidItem, state } from "./state.js";

async function loadItems(render) {
  state.isLoading = true;
  state.error = null;
  render();

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    const rawItems = Array.isArray(json.items) ? json.items : [];
    state.items = rawItems.filter(isValidItem);
    state.lastLoadedAt = new Date();
    state.selectedId = state.items.some((item) => item.id === state.selectedId) ? state.selectedId : null;
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.isLoading = false;
    render();
  }
}

export { loadItems };