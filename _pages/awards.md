---
layout: page
permalink: /awards/
title: awards
description: Awards, honors, scholarships, and fellowships.
nav: true
nav_order: 5
---

{% comment %} Data lives in \_data/awards.yml — listed in file order. {% endcomment %}

<ul class="awards-list">
  {% for award in site.data.awards %}
    <li class="awards-item">
      <span class="awards-name">{{ award.name }}</span>
      {% if award.date %}<span class="awards-date">{{ award.date }}</span>{% endif %}
    </li>
  {% endfor %}
</ul>
