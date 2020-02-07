exports.input = {
  text: "Tweet data with some unknown entities will not break the text",
  entities: {
    unknown: [
      {
        indices: [0, 10]
      }
    ]
  }
};

exports.output =
  "Tweet data with some unknown entities will not break the text";
