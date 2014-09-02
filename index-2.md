---
layout: default
---

{% for post in site.posts %}
<article>
  <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>

  {{ post.excerpt | truncatewords: 63 }}
  <a class="read-more" href="{{ post.url }}">Read full post</a>
  </p>
</article>
{% endfor %}