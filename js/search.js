// This is a clobbered together mess.

function Search()
{
  this.titles = [];
  this.documents = [];
  this.corpus = {};
  this.titleCorpus = {};
}

Search.prototype = {

  // Add to the term to the given frequency maps
  _add: function(words, maps) {
    var length = words.length,
        num_maps = maps.length,
        insertions = [],
        word = '',
        _map;

    for (var j = 0; j < num_maps; j++) {
      _map = maps[j];
      insertions[j] = 0;

      for (var i = 0; i < length; i++) {
        word = stemmer(words[i]);

        if (word in _map) {
          _map[word]++;
        } else {
          insertions[j]++;
          _map[word] = 1.0;
        }
      }
    }

    return insertions;
  },

  // word count in doc / unique words in doc
  _rank: function(map, weight) {
    for (word in map) {
      map[word] /= weight;
    }
  },

  addDocument: function(url, title, titleWords, docWords) {
    var docmap = {},
        titlemap = {},
        insertions;

    insertions = this._add(docWords, [docmap, this.corpus]);
    this._rank(docmap, insertions[0]);

    insertions = this._add(titleWords, [titlemap, this.titleCorpus]);
    this._rank(titlemap, insertions[0]);

    this.titles.push([title, titlemap]);
    this.documents.push([url, docmap]);
  },

  doSearch: function(search) {
    var matches = [],
        max_results = 10,
        search_terms = {},
        length = this.documents.length,
        docWords, titleWords,
        term, score;

    this._rank(
      search_terms,
      this._add(search, [search_terms])[0]
    );

    for (var i = 0; i < length; i++) {
      titleWords = this.titles[i][1];
      docWords = this.documents[i][1];
      score = 0.0;

      for (w in search_terms) {
        if (w in docWords) {
          score += (search_terms[w] / this.corpus[w]) +
               (docWords[w] / this.corpus[w]);
        }

        if (w in titleWords) {
          score += (search_terms[w] / this.titleCorpus[w]) +
               (titleWords[w] / this.titleCorpus[w]);
        }
      }

      if (score > 0) {
        matches.push([this.documents[i][0], this.titles[i][0], score]);
      }
    }

    matches.sort(function(a, b) {
      return b[2] - a[2];
    });

    return matches.slice(0, max_results);
  }
};

SearchPage = {

  init: function() {
    var terms = window.location.search.match(/q=(.*?)(?:&|$)/),
        searched = '';

    if (terms) {
      searched = decodeURIComponent(terms[1]);
      searched = SearchPage.cleanSearchString(searched);

      var S = new Search([]);

      for (var i = 0; i < post_urls.length; i++) {
        S.addDocument(post_urls[i], post_titles[i], post_titles_cleaned[i].split(' '), post_bodies[i].split(' '));
      }

      var results = S.doSearch(searched);

      // yuck
      if (results.length) {
        SearchPage.buildResultRow(results);
      } else {
        document.querySelector('.green').className = 'red';
      }
    }

    this.fillAndShowSearchBox(searched);
  },

  fillAndShowSearchBox: function(searched) {
    var searchbox = document.getElementsByTagName('input')[0];

    setTimeout(function() { showSearch() }, 100);
    searchbox.value = searched;
  },

  cleanSearchString: function(searched) {
    searched = searched.toLowerCase();
    searched = searched.replace(/[^\w]/g, ' ');
    searched = searched.replace(/\b(a|an|and|are|as|at|be|but|by|do|for|gt|how|i|if|in|into|is|it|j|k|ll|lt|no|not|of|on|or|quot|s|such|t|that|the|their|then|there|these|they|this|to|v|w|was|will|with|you|your)\b/g, ' ');

    searched = searched.replace(/\s+/g, ' ');
    searched = searched.replace(/(^\s+|\s+$)/, '').split(' ');
    return searched;
  },

  buildResultRow: function(results) {
    var article = document.getElementsByTagName('article')[0],
        main = document.getElementsByTagName('article')[0];

    article.getElementsByTagName('p')[0].remove();
    article.appendChild(document.createElement('h1'));

    for (i = 0; i < results.length; i++) {
      var fragment = document.createElement('div');
          fragment.innerHTML = '<article><ul><li><a></a></li></ul></article>'

      var a = fragment.getElementsByTagName('a')[0];
      a.href = results[i][0];
      a.innerText = results[i][1];

      main.appendChild(fragment.getElementsByTagName('article')[0]);
    }
  }
};


SearchPage.init();