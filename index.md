---
layout: default
---

{% for post in site.posts %}
<article>
  <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>

  {{ post.excerpt }}
  <a class="read-more" href="{{ post.url }}">Read full post</a>
</article>
{% endfor %}

<script>

// remove footnotes that make it onto the homepage
var fn = document.querySelectorAll('.footnote');

for (var i = 0; i < fn.length; i++) {
	var sup = fn[i].parentNode;
	sup.parentNode.removeChild(sup);
}

// remove footnotes footer sections, silly markdown parser
var fns = document.querySelectorAll('.footnotes');

for (var i = 0; i < fn.length; i++) {
	fns[i].parentNode.removeChild(fns[i]);
}

// Jekyll's excerpt returns paragraphs and there's no
// good way to remove the last </p>, so the read more link
// needs to be moved manually
var articles = document.querySelectorAll('article');

for (var i = 0; i < articles.length; i++) {
  var paragraphs = articles[i].querySelectorAll('p'),
      link = articles[i].querySelector('.read-more'),
      space = document.createTextNode(' ');

  paragraphs[paragraphs.length - 1].appendChild(space);
  paragraphs[paragraphs.length - 1].appendChild(link);
}

</script>