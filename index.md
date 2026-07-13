---
layout: default
title: Runze Ni
description: Renal physiology, photography, cocktail notes, and working studies by Runze Ni.
hide_breadcrumb: true
---

{% assign profile = site.data.profile %}

<div class="landing-container">
  <nav class="quick-nav-buttons" aria-label="Portfolio sections">
    <a href="{{ '/fotos/' | relative_url }}" class="quick-nav-btn">Fotos</a>
    <a href="{{ '/cine/' | relative_url }}" class="quick-nav-btn">Cine</a>
    <a href="{{ '/protocols/' | relative_url }}" class="quick-nav-btn">Protocol</a>
    <a href="{{ '/misc/' | relative_url }}" class="quick-nav-btn">Notes</a>
  </nav>

  <section class="hero-section" id="hero-section">
    <h1 class="hero-title">{{ profile.name }}</h1>
    <p class="hero-subtitle">{{ profile.title }} · {{ profile.tagline }}</p>
    <p class="hero-contact">
      <a href="mailto:{{ profile.email }}">{{ profile.email }}</a> ·
      <a href="{{ profile.links.scholar }}" target="_blank" rel="noopener noreferrer">Google Scholar</a> ·
      <a href="{{ profile.links.linkedin }}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
      <li><a href="https://doi.org/{{ item.doi }}" target="_blank" rel="noopener noreferrer"><strong>{{ item.title }}</strong></a> <em>{{ item.citation }}</em> doi:{{ item.doi }}</li>
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
