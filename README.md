# Tweet markdown renderer

[![npm](https://img.shields.io/npm/v/tweet.md.svg?style=flat-square)](https://www.npmjs.com/package/tweet.md)
[![Travis](https://img.shields.io/travis/silentroach/tweet.md.svg?style=flat-square&label=travis)](https://travis-ci.org/silentroach/tweet.md)
[![Coveralls](https://img.shields.io/coveralls/silentroach/tweet.md.svg?style=flat-square&label=coverage)](https://coveralls.io/r/silentroach/tweet.md)

Render your [tweets](https://dev.twitter.com/overview/api/tweets) with [entities](https://dev.twitter.com/overview/api/entities) to beautiful markdown.

## Installing

You can install the latest package version for [Node.js](https://nodejs.org):

```
$ npm install tweet.md
```

## How to use

Just as you think it should be used:

```js
var render = require('tweet.md');
var output = render(tweetObjectFromAPI);
```

## Examples

<!-- CUT -->

### [01-link.json](examples/01-link.json)

Removing the 140 character limit from Direct Messages [twittercommunity.com/t/removing-the…](https://t.co/h0I2M3P2vm "https://twittercommunity.com/t/removing-the-140-character-limit-from-direct-messages/41348/")
- - -

### [02-multiline.json](examples/02-multiline.json)

Tweet poems you like  
at [#TwitterPoetryClub](https://twitter.com/search?q=%23TwitterPoetryClub)  
prose, sonnets and more  
  
Via [@bustle](https://twitter.com/bustle "Bustle"), learn how to wax poetic on Twitter: [bustle.com/articles/10068…](http://t.co/vItyyGqX7R "http://www.bustle.com/articles/100683-twitterpoetryclub-members-share-their-love-of-poetry-in-140-characters-or-less")
- - -

### [03-russian.json](examples/03-russian.json)

Привет! С вами сегодня и всю неделю [@pepelsbey](https://twitter.com/pepelsbey "Вадим Макеев"), он же Вадим Макеев в прямом эфире из Осло, см. глобус Европы [pic.twitter.com/clb7TLnxZS](http://t.co/clb7TLnxZS)
- - -

### [04-ctags.json](examples/04-ctags.json)

[$APPL](https://twitter.com/search?q=%23APPL&src=ctag) set to jump this morning. General rebound in the market today. Yesterday was a good time to buy into the panic.
- - -

### [05-emoji.json](examples/05-emoji.json)

Keep your Tweets 💯 by adding emojis every day, but especially on [#WorldEmojiDay](https://twitter.com/search?q=%23WorldEmojiDay)! 💪😂👯

