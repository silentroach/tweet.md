exports.input = {
  text: "Just[] *test _the (mark><down) \\ #escaping"
};

exports.output =
  "Just\\[\\] \\*test \\_the \\(mark&gt;&lt;down\\) \\\\ \\#escaping";
