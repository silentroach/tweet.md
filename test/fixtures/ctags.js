exports.input = {
  text:
    "$APPL set to jump this morning. General rebound in the market today. Yesterday was a good time to buy into the panic.",
  entities: {
    symbols: [
      {
        text: "APPL",
        indices: [0, 5]
      }
    ]
  }
};

exports.output =
  "[$APPL](https://twitter.com/search?q=%23APPL&src=ctag) set to jump this morning. General rebound in the market today. Yesterday was a good time to buy into the panic.";
