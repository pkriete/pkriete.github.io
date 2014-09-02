---
title: "Search Results"
permalink: /search/
no_index: true
show_menu: false
---

No Results Found.

{% capture closing_brace %}}{% endcapture %}

{% assign post_urls = site.posts | sort: 'title' | map: 'url' %}

{% assign post_titles = site.posts | map: 'title' | sort %}
{% assign post_bodies = site.posts | sort: 'title' | map: 'content' %}

{% capture cleaned_title_data %}
  {% for title in post_titles %}
    {{ title | strip_html | replace: "\n", ' ' | replace: "\t", ' ' | remove: "  " | downcase | replace: '!', ' ' | replace: '.', ' ' | replace: ',', ' ' | replace: ':', ' ' | replace: ';', ' ' | replace: '>', ' ' | replace: '<', ' ' | replace: '-', ' ' | replace: '&', ' ' | replace: "'", ' ' | replace: "’", ' ' | replace: "_", ' ' | replace: "+", ' ' | replace: "=", ' ' | replace: "*", ' ' | replace: "#", ' ' | replace: "$", ' '| replace: '(', ' ' | replace: ')', ' ' |  replace: '[', ' ' | replace: ']', ' ' |  replace: '{', ' ' |  replace: closing_brace, ' ' | replace: '/', ' ' | replace: '?', ' ' | replace: '\', ' ' | replace: ';', ' ' |  replace: '0', ' ' | replace: '1', ' ' | replace: '2', ' ' | replace: '3', ' ' | replace: '4', ' ' | replace: '5', ' ' | replace: '6', ' ' | replace: '7', ' ' | replace: '8', ' ' | replace: '9', ' ' | replace: ' a ', ' ' | replace: ' an ', ' ' | replace: ' and ', ' ' | replace: ' are ', ' ' | replace: ' as ', ' ' | replace: ' at ', ' ' | replace: ' be ', ' ' | replace: ' but ', ' ' | replace: ' by ', ' ' | replace: ' for ', ' ' | replace: ' gt ', ' ' | replace: ' i ', ' ' | replace: ' if ', ' ' | replace: ' in ', ' ' | replace: ' into ', ' ' | replace: ' is ', ' ' | replace: ' it ', ' ' | replace: ' j ', ' ' | replace: ' k ', ' ' | replace: ' ll ', ' ' |  replace: ' lt ', ' ' | replace: ' no ', ' ' | replace: ' not ', ' ' | replace: ' of ', ' ' | replace: ' on ', ' ' | replace: ' or ', ' ' | replace: ' quot ', ' ' | replace: ' s ', ' ' | replace: ' such ', ' ' | replace: ' t ', ' ' | replace: ' that ', ' ' | replace: ' the ', ' ' | replace: ' their ', ' ' | replace: ' then ', ' ' | replace: ' there ', ' ' | replace: ' these ', ' ' | replace: ' they ', ' ' | replace: ' this ', ' ' | replace: ' to ', ' ' | replace: ' v ', ' ' | replace: ' w ', ' ' | replace: ' was ', ' ' | replace: ' will ', ' ' | replace: ' with ', ' ' | replace: ' x ', ' ' | replace: ' y ', ' ' | replace: ' you ', ' ' | replace: ' your ', ' ' | split: ' ' | sort | join: ' ' | jsonify }},
  {% endfor %}
  ''
{% endcapture %}

{% capture cleaned_body_data %}
  {% for body in post_bodies %}
    {{ body | strip_html | replace: "\n", ' ' | replace: "\t", ' ' | remove: "  " | downcase | replace: '!', ' ' | replace: '.', ' ' | replace: ',', ' ' | replace: ':', ' ' | replace: ';', ' ' | replace: '>', ' ' | replace: '<', ' ' | replace: '-', ' ' | replace: '&', ' ' | replace: "'", ' ' | replace: "’", ' ' | replace: "_", ' ' | replace: "+", ' ' | replace: "=", ' ' | replace: "*", ' ' | replace: "#", ' ' | replace: "$", ' '| replace: '(', ' ' | replace: ')', ' ' |  replace: '[', ' ' | replace: ']', ' ' |  replace: '{', ' ' |  replace: closing_brace, ' ' | replace: '/', ' ' | replace: '?', ' ' | replace: '\', ' ' | replace: ';', ' ' |  replace: '0', ' ' | replace: '1', ' ' | replace: '2', ' ' | replace: '3', ' ' | replace: '4', ' ' | replace: '5', ' ' | replace: '6', ' ' | replace: '7', ' ' | replace: '8', ' ' | replace: '9', ' ' | replace: ' a ', ' ' | replace: ' an ', ' ' | replace: ' and ', ' ' | replace: ' are ', ' ' | replace: ' as ', ' ' | replace: ' at ', ' ' | replace: ' be ', ' ' | replace: ' but ', ' ' | replace: ' by ', ' ' | replace: ' for ', ' ' | replace: ' gt ', ' ' | replace: ' i ', ' ' | replace: ' if ', ' ' | replace: ' in ', ' ' | replace: ' into ', ' ' | replace: ' is ', ' ' | replace: ' it ', ' ' | replace: ' j ', ' ' | replace: ' k ', ' ' | replace: ' ll ', ' ' |  replace: ' lt ', ' ' | replace: ' no ', ' ' | replace: ' not ', ' ' | replace: ' of ', ' ' | replace: ' on ', ' ' | replace: ' or ', ' ' | replace: ' quot ', ' ' | replace: ' s ', ' ' | replace: ' such ', ' ' | replace: ' t ', ' ' | replace: ' that ', ' ' | replace: ' the ', ' ' | replace: ' their ', ' ' | replace: ' then ', ' ' | replace: ' there ', ' ' | replace: ' these ', ' ' | replace: ' they ', ' ' | replace: ' this ', ' ' | replace: ' to ', ' ' | replace: ' v ', ' ' | replace: ' w ', ' ' | replace: ' was ', ' ' | replace: ' will ', ' ' | replace: ' with ', ' ' | replace: ' x ', ' ' | replace: ' y ', ' ' | replace: ' you ', ' ' | replace: ' your ', ' ' | split: ' ' | sort | join: ' ' | jsonify }},
  {% endfor %}
  ''
{% endcapture %}

<script>
var post_titles = {{ post_titles | jsonify }};
var post_titles_cleaned = [{{ cleaned_title_data | remove: "    " | strip_newlines }}];
var post_urls = {{ post_urls | jsonify }};
var post_bodies = [{{ cleaned_body_data | remove: "    " | strip_newlines }}];
</script>

<script src="/js/stemmer.js"></script>
<script src="/js/search.js"></script>