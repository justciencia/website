---
layout: default
title: Topics
permalink: /topics/
description: "Explainers, graph guides, and paper summaries, grouped by topic."
---
{% include collect.html %}
{% assign cats = site.categories | sort %}
<section class="page-head">
  <div class="container">
    <div class="eyebrow">Browse</div>
    <h1>Topics</h1>
  </div>
</section>
<section class="page-body">
  <div class="container">
    <div class="narrow">
      <p class="section-intro" style="margin:0 0 40px;">The supporting stories behind the profiles, grouped by topic.</p>
      {% for c in cats %}
      {% assign cname = c[0] %}
      {% capture block %}{% for post in c[1] %}{% if post.approved_by_scientist != false and post.layout != 'profile' and post.scientist == nil %}{% include post-row.html post=post %}{% endif %}{% endfor %}{% endcapture %}
      {% assign block = block | strip %}
      {% if block != "" %}
      <div class="topic-block c-{{ site.category_colors[cname] | default: 'clay' }}" id="{{ cname | slugify }}">
        <h2>{{ cname }}</h2>
        {{ block }}
      </div>
      {% endif %}
      {% endfor %}
    </div>
  </div>
</section>
