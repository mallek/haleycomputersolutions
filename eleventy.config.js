const POSTS_GLOB = "src/posts/*.md";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// A markdown image on its own line becomes the site's figure:
//   ![alt text](assets/img/photo.jpg "Caption")   a real photo, path from the site root
//   ![what goes here](placeholder "Caption")      a labelled placeholder box
// Posts live in posts/, so real paths get "../" in front.
function figureHtml(src, alt, caption) {
  const shot = src === "placeholder"
    ? `<div class="shot shot--wide shot--placeholder"><span class="shot__label">PHOTO PLACEHOLDER<br>${escapeHtml(alt)}</span></div>`
    : `<div class="shot shot--wide"><img src="../${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy"></div>`;
  const cap = caption ? `<figcaption class="figure__caption">${escapeHtml(caption)}</figcaption>` : "";
  return `<figure class="figure">${shot}${cap}</figure>\n`;
}

function figuresPlugin(md) {
  md.core.ruler.after("inline", "hcs_figures", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      const inline = tokens[i + 1];
      const isLoneImage = tokens[i].type === "paragraph_open"
        && inline.type === "inline"
        && inline.children.length === 1
        && inline.children[0].type === "image"
        && tokens[i + 2].type === "paragraph_close";
      if (!isLoneImage) {
        continue;
      }
      const image = inline.children[0];
      const block = new state.Token("html_block", "", 0);
      block.content = figureHtml(image.attrGet("src"), image.content, image.attrGet("title"));
      tokens.splice(i, 3, block);
    }
  });

  // Tables scroll sideways on a phone instead of breaking the page.
  md.renderer.rules.table_open = () => '<div class="table-scroll"><table>\n';
  md.renderer.rules.table_close = () => "</table></div>\n";
}

export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setOutputDirectory("_site");
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.amendLibrary("md", (md) => md.use(figuresPlugin));

  // Build logs, newest first.
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob(POSTS_GLOB).sort((a, b) => b.date - a.date));

  eleventyConfig.addFilter("head", (list, count) => list.slice(0, count));
  eleventyConfig.addFilter("stripSlash", (url) => url.replace(/^\//, ""));
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));
  eleventyConfig.addFilter("niceDate", (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }));
  eleventyConfig.addFilter("postsJson", (posts) =>
    JSON.stringify(posts.map((post) => ({
      hash: post.data.commit,
      title: post.data.title,
      url: post.url.replace(/^\//, ""),
      tags: post.data.tags,
      date: post.date.toISOString().slice(0, 10)
    })), null, 2));

  return {
    // Posts are plain markdown. No template syntax runs inside them, so code
    // samples with braces are safe.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk"
  };
}
