document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-tool-bookmarklet]").forEach((link) => {
        const key = link.dataset.toolBookmarklet;
        const source = window.toolBookmarkletSources && window.toolBookmarkletSources[key];
        if (source) link.setAttribute("href", "javascript:" + encodeURIComponent(source));
    });
});
