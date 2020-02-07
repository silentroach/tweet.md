exports.input = {
  text: "http://t.co/rYdyv2gX12, http://t.co/32mCbc9Jyr",
  entities: {
    urls: [
      {
        url: "http://t.co/rYdyv2gX12",
        expanded_url:
          "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html",
        display_url: "webpack.github.io/docs/hot-modul…",
        indices: [0, 22]
      },
      {
        url: "http://t.co/32mCbc9Jyr",
        expanded_url:
          "http://webpack.github.io/docs/hot-module-replacement.html",
        display_url: "webpack.github.io/docs/hot-modul…",
        indices: [24, 46]
      }
    ]
  }
};

exports.output =
  '[webpack.github.io/docs/hot-modul…](http://t.co/rYdyv2gX12 "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"), [webpack.github.io/docs/hot-modul…](http://t.co/32mCbc9Jyr "http://webpack.github.io/docs/hot-module-replacement.html")';
