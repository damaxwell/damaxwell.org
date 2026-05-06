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

* [Play](ifclaude) interactive fiction games in a browser. Why? Well, if you have the password, actually [Claude](http://claude.ai) plays the game as an agent and chats about he experience with you.  But even without the password, you can still use the app as a standalone IF player. I should really just allow people to provide their own API key and burn their own tokens...
{% endcapture %}
{% include card.html content=curio_card %}