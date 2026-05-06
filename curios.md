---
layout: default
title: Curiosities
---

### Curios

Projects, in various degrees of completion, 
with essentially nothing in common.

{% capture curio_card %}
* A proof of concept derivative [practice tool](dprof/dprof.html).

* [Notes](assets/InvariantMechanics.pdf) on a coordinate-free approach to classical mechanics.

* Vibe coded katakana/hiragana [game](kana-match).

* [Play](ifclaude) interactive fiction games in a browser. Why? Well, if you have the friends and family password, or if you have an Anthropic [API Key](https://platform.claude.com/login), then [Claude](http://claude.ai) plays the game as an agent on its own and you chat with it.  Without the password or an API key you can still still use the app as a standalone IF player.
{% endcapture %}
{% include card.html content=curio_card %}