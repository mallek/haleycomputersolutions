import { execFileSync } from "node:child_process";

// Short hash of the last commit that touched a post. The computer on the home page
// prints these in its git log, so they are real.
function lastCommit(inputPath) {
  try {
    const hash = execFileSync("git", ["log", "-1", "--format=%h", "--", inputPath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return hash || "0000000";
  } catch (err) {
    return "0000000";
  }
}

export default {
  layout: "post.njk",
  nav: "projects",
  eleventyComputed: {
    permalink: (data) => `posts/${data.page.fileSlug}.html`,
    commit: (data) => lastCommit(data.page.inputPath)
  }
};
