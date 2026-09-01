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

        {% comment %} Media rotator: cycles through job.media (a list of images
           and/or videos). Falls back to the single job.image. A lone video
           loops like a GIF; multiple items cross-fade (video → on end, photo →
           after data-photo-interval ms). See assets/js/portfolio.js. {% endcomment %}
        {% assign media_list = job.media %}
        {% if media_list == nil or media_list == empty %}
          {% if job.image %}{% assign media_list = job.image | split: '|' %}{% endif %}
        {% endif %}
        {% if media_list and media_list != empty %}
          <div class="career-media career-rotator" data-photo-interval="5000">
            {% for m in media_list %}
              {% assign m_clean = m | strip %}
              {% assign ext = m_clean | split: '.' | last | downcase %}
              {% if ext == 'mp4' or ext == 'webm' %}
                <video class="career-rotator-item{% if forloop.first %} is-active{% endif %}" muted playsinline preload="metadata" aria-label="{{ job.title | escape }}">
                  <source src="{{ m_clean }}" type="video/{{ ext }}" />
                </video>
              {% else %}
                <img class="career-rotator-item{% if forloop.first %} is-active{% endif %}" src="{{ m_clean }}" alt="{{ job.title | escape }}" loading="lazy" />
              {% endif %}
            {% endfor %}
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
