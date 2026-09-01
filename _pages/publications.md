---
layout: page
permalink: /publications/
title: projects
description: A chronological list of my projects, publications, preprints, and works in progress.
nav: true
nav_order: 2
---

{% comment %}
  Data lives in _data/publications.yml — no search/filter, listed in file order.
  Each entry has `type: publication` or `type: project`; anything without a
  type falls back into Publications.
{% endcomment %}

{% assign projects = site.data.publications | where: "type", "project" %}
{% assign publications = site.data.publications | where_exp: "p", "p.type != 'project'" %}

<section class="pub-section">
  <h2 class="section-title">Publications</h2>
  <div class="pub-list">
    {% for pub in publications %}
      {% include _pub_item.liquid pub=pub %}
    {% endfor %}
  </div>
</section>

<section class="pub-section">
  <h2 class="section-title">Projects</h2>
  <div class="pub-list">
    {% for pub in projects %}
      {% include _pub_item.liquid pub=pub %}
    {% endfor %}
  </div>
</section>
