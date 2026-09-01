---
layout: page
permalink: /community/
title: community
description: Outreach, mentorship, talks, and service — a series of short posts.
nav: true
nav_order: 3
---

{% comment %} Data lives in \_data/community.yml {% endcomment %}

<div class="community-list">
  {% for post in site.data.community %}
    <article class="community-item">
      {% if post.media %}
        <div class="community-media">
          {% case post.media.type %}
            {% when 'image' or 'gif' %}
              <img src="{{ post.media.src }}" alt="{{ post.media.alt | default: post.title }}" loading="lazy" />
            {% when 'video' %}
              <video controls playsinline preload="metadata">
                <source src="{{ post.media.src }}" />
              </video>
            {% when 'link' %}
              <a class="community-media-link" href="{{ post.media.src }}" target="_blank" rel="noopener noreferrer">
                <span>Visit link →</span>
              </a>
          {% endcase %}
        </div>
      {% endif %}
      <div class="community-body">
        {% if post.date %}<span class="community-date">{{ post.date }}</span>{% endif %}
        <h3 class="community-title">
          {% if post.link %}
            <a href="{{ post.link }}" target="_blank" rel="noopener noreferrer">{{ post.title }}</a>
          {% else %}
            {{ post.title }}
          {% endif %}
        </h3>
        <div class="community-blurb">{{ post.blurb | markdownify }}</div>
        {% if post.link %}
          <a class="community-readmore" href="{{ post.link }}" target="_blank" rel="noopener noreferrer">Read more →</a>
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>
