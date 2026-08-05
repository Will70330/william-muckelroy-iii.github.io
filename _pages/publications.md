---
layout: page
permalink: /publications/
title: publications
description: A chronological list of my publications, preprints, and works in progress.
nav: true
nav_order: 2
---

{% comment %} Data lives in _data/publications.yml — no search/filter, listed in file order. {% endcomment %}

<div class="pub-list">
  {% for pub in site.data.publications %}
    <div class="pub-item">
      {% if pub.image %}
        <div class="pub-media">
          <img src="{{ pub.image }}" alt="{{ pub.title | strip_html }}" loading="lazy" />
        </div>
      {% endif %}
      <div class="pub-body">
        <h3 class="pub-title">{{ pub.title }}</h3>
        {% if pub.authors %}
          <p class="pub-authors">{{ pub.authors | markdownify | remove: '<p>' | remove: '</p>' }}</p>
        {% endif %}
        {% if pub.venue %}
          <p class="pub-venue">{{ pub.venue }}</p>
        {% endif %}

        <div class="pub-links">
          {% if pub.coming_soon %}
            <span class="pub-coming-soon">Coming Soon…</span>
          {% endif %}
          {% if pub.links.paper %}<a class="pub-link" href="{{ pub.links.paper }}" target="_blank" rel="noopener noreferrer">Paper</a>{% endif %}
          {% if pub.links.code %}<a class="pub-link" href="{{ pub.links.code }}" target="_blank" rel="noopener noreferrer">Code</a>{% endif %}
          {% if pub.links.video %}<a class="pub-link" href="{{ pub.links.video }}" target="_blank" rel="noopener noreferrer">Video</a>{% endif %}
          {% if pub.links.poster %}<a class="pub-link" href="{{ pub.links.poster }}" target="_blank" rel="noopener noreferrer">Poster</a>{% endif %}
          {% if pub.links.website %}<a class="pub-link" href="{{ pub.links.website }}" target="_blank" rel="noopener noreferrer">Website</a>{% endif %}
          {% if pub.links.bib %}<a class="pub-link" href="{{ pub.links.bib }}" target="_blank" rel="noopener noreferrer">Bib</a>{% endif %}
        </div>
      </div>
    </div>
  {% endfor %}
</div>
