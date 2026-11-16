// `root` is the relative path from a page back to the site root: "" for top-level
// pages, "../" for anything in posts/. Every link and asset path in the templates
// starts with it, so the site works from a subfolder as well as from a domain root.
export default {
  root: (data) => {
    const url = data.page && data.page.url;
    if (!url) {
      return "";
    }
    const depth = url.split("/").length - 2;
    return "../".repeat(Math.max(0, depth));
  }
};
