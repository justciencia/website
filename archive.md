---
layout: default
title: Archive
permalink: /archive/
---
{% include collect.html %}
{% assign old = c_stories | where: "archived", true %}
<section class="page-head">
  <div class="container">
    <div class="eyebrow">Older stories</div>
    <h1>Archive</h1>
  </div>
</section>
<section class="page-body">
  <div class="container">
    <div class="narrow">
      {% for post in old %}{% include post-row.html post=post %}{% endfor %}
      {% if old.size == 0 %}<p class="empty">Nothing here yet.</p>{% endif %}
    </div>
  </div>
</section>
