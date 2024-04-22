---
title: 'Title of the page cms'
description: 'meta description of the page'
customVariable: 'Custom Value'
---

Learn how to use @nuxt/content.
<!--more-->
Full amount of content beyond the more divider.

![my image](/img/AV-EFI-Logo.png)

::alert-prop{type="warning"}
The **alert** component.
::

Attributes work on:

- ![](/favicon.ico){style="display: inline; margin: 0;"} image,
- [link](#attributes){style="background-color: pink;"}, `code`{style="color: cyan;"},
- _italic_{style="background-color: yellow; color:black;"} and **bold**{style="background-color: lightgreen;"} texts.

[Link](/components/prose)

::hero-comp
Default slot text

#description
This will be rendered inside the `description` slot.
::

::card-comp
The content of the card
::

# The Title is {{ $doc.title }} and customVariable is {{ $doc.customVariable || 'defaultValue' }}