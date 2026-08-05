---
layout: page
permalink: /career/
title: career
description: The full journey — expanded into blog-style entries with more depth than the About timeline.
nav: true
nav_order: 4
---

{% comment %} Data lives in _data/career.yml {% endcomment %}

<div class="career-list">
  {% for job in site.data.career %}
    <article class="career-item">
      <div class="career-rail" aria-hidden="true">
        <span class="career-marker"></span>
      </div>
      <div class="career-content">
        <header class="career-head">
          {% if job.logo %}
            <div class="career-logo"><img src="{{ job.logo }}" alt="{{ job.org | default: job.title }}" loading="lazy" /></div>
          {% endif %}
          <div class="career-headings">
            <span class="career-date">{{ job.date }}</span>
            <h3 class="career-title">{{ job.title }}</h3>
            {% if job.org %}<p class="career-org">{{ job.org }}</p>{% endif %}
          </div>
        </header>

        {% if job.image %}
          <div class="career-media">
            <img src="{{ job.image }}" alt="{{ job.title }}" loading="lazy" />
          </div>
        {% endif %}

        <div class="career-desc">{{ job.description | markdownify }}</div>

        {% if job.links %}
          <div class="career-links">
            {% if job.links.website %}<a class="pub-link" href="{{ job.links.website }}" target="_blank" rel="noopener noreferrer">Website</a>{% endif %}
            {% if job.links.code %}<a class="pub-link" href="{{ job.links.code }}" target="_blank" rel="noopener noreferrer">Code</a>{% endif %}
            {% if job.links.paper %}<a class="pub-link" href="{{ job.links.paper }}" target="_blank" rel="noopener noreferrer">Paper</a>{% endif %}
            {% if job.links.video %}<a class="pub-link" href="{{ job.links.video }}" target="_blank" rel="noopener noreferrer">Video</a>{% endif %}
          </div>
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>
