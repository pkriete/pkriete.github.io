---
layout: post
title:  "SSL for Github Pages"
date:   2014-08-27 20:21:52
---

A good SSL setup is a one way street.

In a moment of questionably good ideas (and trying to get an [A+ SSL Score](https://www.ssllabs.com/ssltest/analyze.html?d=pascal.io&hideResults=on)), the [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) header found its way into my nginx config last month. For a website like this, where no user input ever touches the server, encryption is fairly irrelevant. HTTP would be just fine. However, with only <strike>the usual</strike> <ins>one</ins> major vendor [lacking support](http://caniuse.com/#feat=stricttransportsecurity), adopting the HSTS spec means there is no going back. This is good for the internet as a whole, but it bit me when I decided to host the blogging part of this site on Github Pages.


By default all Github Pages sites **are** encrypted. They footed the bill for an expensive wildcard certificate and made encryption the default for the `<username>.github.io` domains. Unfortunately this is not compatible with a custom domain name. That would require handing your private key over to Github.

The only way to get around this problem is to host the site yourself. That always sounds great and it almost never actually is. Aside from the tedious ongoing maintenance, it also means losing the convenience of Git and Github without additional automation. So instead I've opted to just make my server a transparent HTTPS frontend to my Github Pages domain.

## Nginx Config

Since I was already using nginx, the solution that presented itself was surprisingly simple. Nginx can be setup as a reverse proxy, with proxy responses cached for a given duration of time.

{% highlight nginx %}
proxy_cache_path /some/path/cache/gh-pages levels=1:2 keys_zone=gh-pages:10m;

location / {
    proxy_method            GET;
    proxy_pass_request_body off;
    proxy_set_header        Content-Length     "";
    proxy_set_header        Host               $host;
    proxy_set_header        X-Real-IP          $remote_addr;
    proxy_set_header        X-Forwarded-For    $proxy_add_x_forwarded_for;
    proxy_pass              http://pkriete.github.io;

    proxy_cache             gh-pages;
    proxy_cache_valid       5m;
    proxy_cache_use_stale   error timeout invalid_header updating http_500 http_502 http_503 http_504;
}
{% endhighlight %}

The `Host` header is important, this forwards the requested host to Github and lets you use a CNAME file to prevent duplicate content at the `*.github.io` domain. You could of course hardcode it instead of using `$host`.

The final server setup is one application and one config file. No maintenance, no fear of losing a backup, and it's a simple `git push` to publish.