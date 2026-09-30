---
# ======================================================================
#  SCIENTIST PROFILE (new layout)
#  1. Copy this file into the _posts folder.
#     Name it  YYYY-MM-DD-firstname-lastname.md  (for example 2026-11-03-maria-lopez.md).
#     The part after the date (maria-lopez) is this profile's "slug".
#  2. Fill in the fields below. Anything you don't have, delete the line or leave it empty.
#  3. KEEP  approved_by_scientist: false  until the scientist has approved the profile IN WRITING.
#     While it is false the profile is hidden everywhere on the site (home page, Scientists page,
#     Stories, Topics, the feed, previous/next links). Change it to true to publish.
#
#  IMPORTANT: this repository is public. Anyone can read a file on GitHub even while it is hidden
#  on the website. Write drafts in Word or Google Docs, and only add the file here once the
#  scientist has approved it.
# ======================================================================
layout: profile
title: "Dr. First Last: a short, human headline"     # the page title and the link preview title
name: "Dr. First Last"
institution: "University or organization"
field: "Electrochemistry"                             # the Scientists page builds its filter buttons from this
hometown_or_heritage: "Born in City, Country"         # optional, only if they want it shown
hook: "One sentence that makes someone want to read this."   # used on cards and in link previews
quote: "A short pull-quote in their own words."
languages: [en]                                       # [en] or [en, es] once a Spanish version exists
approved_by_scientist: false                          # true = publish. Only after written approval.

# Shown in the "Featured scientist" section on the home page
science_line: "One line about what they study."
path_line: "One line about their journey."
featured: false                                       # true = pin this profile as the Featured scientist

# Photo: put the file in assets/images/scientists/ (about 800px wide) and get written consent first
photo: /assets/images/scientists/first-last.jpg
photo_alt: "Describe the photo for someone who can't see it"
photo_credit: "Photo by ..."

categories: [Scientists]

# The page sections, in order. Paragraphs are separated by a blank line. Keep the indentation.
path_text: |
  The path: their journey, including the obstacles and the turning points.

  Another paragraph if you need one.
science_text: |
  The science, in plain words.
analogy: |
  The analogy, rooted in everyday life. It appears in a highlighted box.
why_text: |
  Why it matters.

learn_more:
  - label: "Their lab page"
    url: "https://example.edu"
    note: "projects and papers"

# To pair this with a Spanish version:
#   give BOTH files the same ref:  (for example ref: maria-lopez)
#   in the Spanish file also set:  lang: es  and  permalink: /es/2026/11/maria-lopez/
#   and set  languages: [en, es]  in both.
# ref: maria-lopez
---
Anything you write here, after the line of dashes, appears after "Why it matters" and before "Learn more".
