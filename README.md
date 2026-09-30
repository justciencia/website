# justciencia

A science blog for GitHub Pages. A blog layout with a warm color palette: featured post, filterable post list, sidebar, reading-friendly post pages, topics page, and light/dark mode.

## How the site is organized

- **Scientists** are the centerpiece. A profile is a file in `_posts` that uses the profile layout (see `_templates/scientist-profile.md`).
- **Stories** are the supporting content: explainers, graph guides, and paper summaries. A story can link to a related profile with `related_scientist: the-profile-slug`.
- **Approval.** A post with `approved_by_scientist: false` is hidden everywhere on the site. A post with no such field (older pages, stories) counts as approved. This repository is public, so draft unapproved profiles somewhere private.
- **Homepage and search text** (headline, subline, buttons, page title, descriptions, and the Spanish versions) live in one file: `_data/copy.yml`.
- **Spanish pages** live under `/es/`. Pair an English and a Spanish post by giving both the same `ref:`, and mark the Spanish one `lang: es` with a `permalink:` starting with `/es/`.
- **Analytics** are off until you paste a GoatCounter site code into `_data/analytics.yml`.
- **Nominations** (the form on the Scientists page) are connected in `_data/applications.yml`; open or close them with the checkbox in the Google Sheet.

## Publish it (about 5 minutes)

1. Create a new public repository on GitHub. Two options for the name:
   - `website` -> site lives at `https://justciencia.github.io/website/` (set `baseurl: "/website"`)
   - `justciencia.github.io` -> site lives at `https://justciencia.github.io/` (set `baseurl: ""`)
2. Upload everything in this folder to the repo (drag and drop works on github.com, or use git). Include the hidden files.
3. Open `_config.yml` and check `url` and `baseurl` (see the comments in the file)
4. In the repo, go to **Settings > Pages**, set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, and save.
5. Wait a minute or two. GitHub builds the site and shows the address at the top of the Pages settings.

## Write a post

Add a file to the `_posts` folder named `YYYY-MM-DD-your-title.md`, for example `2026-10-06-what-is-an-electrolyzer.md`, that starts like this:

```
---
title: "What is an electrolyzer?"
description: "One or two sentences. Shown on the home page and under the title."
categories: [Electrochemistry]
---

Your text here, in Markdown.
```

- `categories` takes one topic. It sets the color, the filter chips, and the Topics page.
- Optional: `image: /assets/images/my-figure.png`, `image_alt: "..."`, `image_caption: "..."` for a large image under the title.
- A post dated in the future will not appear until that date.
- Delete the three sample posts in `_posts` when you're ready.

### Handy Markdown

- Headings: `## Section`, `### Subsection`
- Pull quote: start a line with `> `
- Highlighted box: put `{: .callout}` on the line above a paragraph
- Figure with caption:
  ```
  <figure>
    <img src="{{ '/assets/images/electrolyzer.png' | relative_url }}" alt="Diagram of an electrolyzer">
    <figcaption>Caption text.</figcaption>
  </figure>
  ```
- Subscripts and superscripts: `H<sub>2</sub>O`, `Cl<sup>&minus;</sup>`
- Divider: `---`

## Post features

Add these to a post's top section (between the `---` lines) to turn features on:

- `vocab:` adds a "Key terms in Spanish" flashcard box at the bottom (`en`, `es`, and an optional `note`). Spanish appears only here; the rest of the post is in English.
- `paper:` adds an "Original paper" box (title, authors, journal, year, url, and `status`: peer-reviewed or preprint).
- `glance:` adds a three-line "At a glance" summary box (`question`, `found`, `catch`).
- `graph:` adds a "Graph guide" cheat-sheet box for how-to-read-a-graph posts (`name`, `x`, `y`, `set`, `learn`).
- `scientist:` adds a profile card (name, title, university, field, research, bio, photo, links) and puts the post on the Featured scientists page. There it appears as a photo tile, and "View profile" opens a pop-up with the bio and links. Start from `_templates/scientist-spotlight.md`. Photos go in `assets/images/scientists/`.
- `scripts: [ph-explorer]` loads an interactive script from `assets/js/`.
- Cite sources with footnotes: put a marker like `[^1]` after a claim, and add a `[^1]: Citation here.` line at the bottom of the post.

To write a paper explainer, a graph guide, or a scientist spotlight, copy `_templates/paper-explained.md`, `_templates/graph-guide.md`, or `_templates/scientist-spotlight.md` into `_posts`, rename it with a date, and fill it in.

## Nominations: the form on the Scientists page

The Scientists page can show a collapsed "Nominate a scientist" form. Applications are saved to a private Google Sheet through a small Google Apps Script.

- To switch it on, paste the script's Web app URL into `_data/applications.yml`. Leave it empty and the section stays hidden.
- To open or close applications, tick or untick the box in the sheet's "Settings" tab. It takes effect instantly and needs no upload here.

## Topic colors

In `_config.yml`, `category_colors` maps a topic to `clay` (orange), `yellow`, `rust` (red), or `green`. Topics not listed use orange.

## Preview on your computer (optional)

Install Ruby, then run `bundle install` and `bundle exec jekyll serve` in this folder and open http://localhost:4000/website/.

## What's where

| File or folder | What it does |
|---|---|
| `_config.yml` | Site name, tagline, author, colors per topic |
| `_posts/` | Your posts |
| `about.md`, `topics.md` | The About and Topics pages |
| `index.html` | Home page |
| `_layouts/`, `_includes/` | Page templates and shared pieces (header, footer) |
| `assets/css/style.css` | All styling; the color palette is at the top |
| `assets/js/site.js` | Dark mode, scroll battery, topic filter |
