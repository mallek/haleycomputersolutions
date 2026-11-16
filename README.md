# haleycomputersolutions.com

The Haley Computer Solutions website. Static site, built with Eleventy, hosted on GitHub Pages.

## Run it

```
npm install
npm start
```

`npm start` serves the site locally and rebuilds on save. `npm run build` writes the site to `_site/`.

Pushing to `master` builds and deploys it.

## Add a build log

One post is one markdown file in `src/posts/`. The file name becomes the URL: `src/posts/my-thing.md` is published at `posts/my-thing.html`.

```markdown
---
title: "My Thing"
date: 2026-11-16
description: "One line. Shown in the build list and to search engines."
tags: ["hw", "3d"]
chips: ["ESP32-C3", "BLE"]
read: "4 min read"
thumb: assets/img/my-thing-thumb.jpg
lead:
  src: assets/img/my-thing-lead.jpg
  alt: "The board on the cutting mat"
  caption: "Rev B, assembled."
specs:
  - ["MCU", "ESP32-C3"]
  - ["Power", "USB-C (5V)"]
parts:
  - "XIAO ESP32-C3"
  - "3D printed enclosure"
files:
  - '<a href="https://github.com/mallek/my-thing">Firmware (GitHub)</a>'
---

## The Goal

Body text in plain markdown.
```

Field notes:

- `tags` are the discipline codes: `hw`, `sw`, `web`, `3d`, `lab`. The first one is the fallback shown when a post has no thumbnail. Names for the codes are in `src/_data/tagNames.json`.
- `chips` are free-text keywords shown next to the tags.
- `thumb` is a 3:2 image for the build list. Leave it out and the list shows the first tag code instead. `thumb: placeholder` shows an empty photo slot.
- `lead` is the 16:9 photo at the top. Leave `src` out and set `placeholder: "what the photo will be"` to show a labelled box.
- `specs`, `parts`, `files`, `chips`, `read`, and `lead` are all optional. A missing one is left off the page.
- Image paths are written from the site root, such as `assets/img/photo.jpg`. Put the files in `src/assets/img/`.

In the body:

- A photo on its own line becomes a figure with a caption: `![alt text](assets/img/photo.jpg "Caption")`
- A photo you have not taken yet: `![what goes here](placeholder "Caption")`
- A value you have not measured yet: `<span class="todo">[PIN]</span>`
- A highlighted note: `<p class="callout">Text.</p>`
- Tables and fenced code blocks are plain markdown.

## Where things are

- `src/_includes/base.njk` is the page shell: head, header, footer.
- `src/_includes/post.njk` is the post layout.
- `src/index.njk`, `src/projects.njk`, `src/contact.njk` are the three pages.
- `src/assets/css/site.css` has every color, font, and spacing value as a token at the top.
- `src/assets/js/terminal.js` is the computer on the home page and the terminal it opens. Commands go in `handleCommand`.
- `src/assets/logo/` has the logo files.

All links are relative, so the site works from a subfolder as well as from the domain root.
