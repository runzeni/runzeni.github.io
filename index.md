---
layout: default
title: Runze Ni
description: Photos & working studies by Runze.
hide_breadcrumb: true
---

{% assign profile = site.data.profile %}

<div class="landing-container">
  <nav class="quick-nav-buttons" aria-label="Portfolio sections">
    <a href="{{ '/fotos/' | relative_url }}" class="quick-nav-btn">Fotos</a>
    <a href="{{ '/protocols/' | relative_url }}" class="quick-nav-btn">Protocols</a>
    <a href="{{ '/notes/' | relative_url }}" class="quick-nav-btn">Notes</a>
    <a href="{{ '/misc/' | relative_url }}" class="quick-nav-btn">Misc</a>
  </nav>

  <section class="hero-section" id="hero-section">
    <h1 class="hero-title">{{ profile.name }}</h1>
    <p class="hero-subtitle">{{ profile.title }} · {{ profile.tagline }}</p>
    <p class="hero-contact">
      <button type="button" class="text-link" data-copy-email data-copy-value="{{ profile.email }}" aria-label="Copy {{ profile.email }}">{{ profile.email }}</button> ·
      <a href="{{ profile.links.scholar }}" target="_blank" rel="noopener noreferrer">Google Scholar</a>
    </p>
  </section>
</div>

<section class="profile-section" aria-labelledby="about">
  <h2 id="about">About</h2>
  <p>{{ profile.about }}</p>
</section>

<section class="profile-section" aria-labelledby="education">
  <h2 id="education">Education</h2>
  {% for item in profile.education %}
    <p><strong>{{ item.degree }}</strong><br>{{ item.institution }}, {{ item.location }} ({{ item.years }})</p>
  {% endfor %}
</section>

<section class="profile-section" aria-labelledby="experience">
  <h2 id="experience">Research experience</h2>
  {% for item in profile.experience %}
    <p><strong>{{ item.role }}</strong><br>{{ item.institution }} ({{ item.years }}){% if item.detail %}<br><em>{{ item.detail }}</em>{% endif %}</p>
  {% endfor %}
</section>

<section class="profile-section" aria-labelledby="publications">
  <h2 id="publications">Selected publications</h2>
  <ul>
    {% for item in profile.publications %}
      <li>
        {% if item.doi %}<a href="https://doi.org/{{ item.doi }}" target="_blank" rel="noopener noreferrer"><strong>{{ item.title }}</strong></a>{% elsif item.url %}<a href="{{ item.url }}" target="_blank" rel="noopener noreferrer"><strong>{{ item.title }}</strong></a>{% else %}<strong>{{ item.title }}</strong>{% endif %}
        <em>{{ item.citation }}</em>{% if item.doi %} doi:{{ item.doi }}{% elsif item.identifier %} {{ item.identifier }}{% endif %}
      </li>
    {% endfor %}
  </ul>
</section>

<section class="profile-section" aria-labelledby="presentations">
  <h2 id="presentations">Selected presentations</h2>
  <ul>
    {% for item in profile.presentations %}
      <li>{% if item.doi %}<a href="https://doi.org/{{ item.doi }}" target="_blank" rel="noopener noreferrer"><strong>{{ item.title }}</strong></a>{% else %}<strong>{{ item.title }}</strong>{% endif %} <em>{{ item.event }}</em></li>
    {% endfor %}
  </ul>
</section>

<section class="profile-section" aria-labelledby="projects">
  <h2 id="projects">Current work</h2>
  <ul>
    {% for project in profile.projects %}<li>{{ project }}</li>{% endfor %}
  </ul>
</section>
