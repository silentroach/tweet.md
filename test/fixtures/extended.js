exports.input = {
  text: "some original text",
  full_text: "should prefer full_text over text",

  extended_tweet: {
    text: "some other original text",
    full_text: "should prefer extended_tweet over base"
  }
};

exports.output = "should prefer extended\\_tweet over base";
