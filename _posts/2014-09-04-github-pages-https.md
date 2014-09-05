---
title:  "SSL for Github Pages"
date:   2014-09-04 22:22:22
color:  pink
---

The movement to encrypt the internet[^encrypt-the-web] has been growing steadily. It seems ironic, but one of the best ways to ensure a truly open web, is to lock it down completely. Encryption can help prevent a large number of problems: from social networking vandalism, to censoring of information, to monetary and identity theft, all the way to plain old spying. Encrypting the web is good for everyone.

So what does this have to do with Github Pages?


By default all Github Pages sites **are** encrypted. They footed the bill for an expensive wildcard certificate and made encryption the default for the `<username>.github.io` domains. Unfortunately this is not compatible with a custom domain name. Supporting that would require collecting private keys from everyone.

One way to get around this problem is to host the site yourself. Unfortunately this means losing all of the convenience of Github Pages. I wanted to find a system that allowed me to continue to use Github Pages without any complicated maintenance.

## Nginx Proxy

The solution that presented itself was simple. A cheap server with nginx can handle all of my SSL needs and then act as a [reverse proxy][Proxy-module-docs] to the Github Pages domain. This approach is similar to [how Wikipedia does SSL termination][wikipedia-ssl-termination].

The SSL configuration is the complicated part:

{% highlight nginx %}
server {
    listen       443 ssl spdy;
    server_name  example.com;
    root         /usr/share/nginx/html;

    ssl                  on;
    ssl_certificate      /usr/share/nginx/cert.crt;
    ssl_certificate_key  /usr/share/nginx/private.key;
    ssl_dhparam          /usr/share/nginx/dhparam.pem;

    ssl_session_timeout  5m;

    ssl_protocols        SSLv3 TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers          HIGH:!aNULL:!MD5;
    ssl_session_cache    shared:SSL:10m;
    ssl_prefer_server_ciphers   on;

    add_header Strict-Transport-Security max-age=15768000;
}
{% endhighlight %}

One thing you will want to hold off on initially is the [HSTS][HSTS Wiki] header. Only add this when you're sure you'll continue to be on SSL. If you're like me, that header may be why you're doing this in the first place.

The proxy config is even simpler. The very basic functionality takes little more than four lines:

{% highlight nginx %}
location / {
    proxy_set_header        Host               $host;
    proxy_set_header        X-Real-IP          $remote_addr;
    proxy_set_header        X-Forwarded-For    $proxy_add_x_forwarded_for;
    proxy_pass              http://<username>.github.io;
}
{% endhighlight %}

At this point everything should work as needed. Passing along the IP address of the visitor is simply part of being a good internet citizen, while the `Host` header ensures that you can continue to use a `CNAME` file to prevent duplicate content from showing up at your `*.github.io` domain.

### Performance Tweaking

The obvious downside to this setup is that every single request has some added latency. Github's servers are fast, as is the box I use to host this site, but we can still apply some basic techniques to speed it up. The first resource drain we want to stop are needlessly large requests. This means first and foremost that we don't want to spend time and resources on passing things like `POST` requests on to Github:

{% highlight nginx %}
location / {
    proxy_method            GET;
    proxy_pass_request_body off;
    proxy_set_header        Content-Length     "";
}
{% endhighlight %}

The second thing we want to limit are requests for unchanged data. With the data from Jekyll being almost entirely static, the server can do some aggressive caching:

{% highlight nginx %}
proxy_cache_path /some/path/cache/gh-pages levels=1:2 keys_zone=gh-pages:10m inactive=24h;

location / {
    proxy_cache             gh-pages;
    proxy_cache_valid       200 302            5m;
    proxy_cache_valid       301                1h;
    proxy_cache_valid       404                1m;
    proxy_cache_use_stale   error timeout invalid_header updating http_500 http_502 http_503 http_504;
}
{% endhighlight %}

Including the `updating` key in `proxy_cache_use_stale` means that most requests will be served from the cache, while nginx updates the stale file in the background.

### Maintenance

The final server setup is one application and one config file. Back up `nginx.conf` and the only maintenance you will ever do is refresh your certificate when it expires. No debugging, no fear of missing a backup, and it's a simple `git push` to publish.

Happy encrypted publishing!

[^encrypt-the-web]: Electronic Frontier Foundation: [Encrypt the Web](https://www.eff.org/encrypt-the-web)
[wikipedia-ssl-termination]: https://wikitech.wikimedia.org/wiki/Https#SSL_termination
[Proxy-module-docs]: http://nginx.org/en/docs/http/ngx_http_proxy_module.html
[HSTS Wiki]: https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security