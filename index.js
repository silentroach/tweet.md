// [ /\//g, '\\/' ],
// [ /\</g, '&lt;' ],
// [ /\>/g, '&gt;' ],

function escapeMarkdown(input) {
	// escaping symbols: # * ( ) [ ] _
	return input.replace(
		/([#\*\(\)\[\]_])/g,
		'\\$1'
	);
}

function renderEntityMention(data) {
	return `[@${escapeMarkdown(data.screen_name)}](https://twitter.com/${data.screen_name} "${data.name}")`;
}

function renderEntityMedia(data) {
	return `[${markdownEscape(data.display_url)}](${data.url})`;
}

function renderEntityHashtag(data) {
	return `[${markdownEscape(data.text)}](https://twitter.com/search?q=%23${data.text})`;
}

function renderEntityUrl(data) {
	return `[${markdownEscape(data.display_url)}](${data.url} "${data.expanded_url}")`;
}

function renderEntity(type, data) {
	switch (type) {
		case 'user_mentions':
			return renderEntityMention(data);
		case 'media':
			return renderEntityMedia(data);
		case 'hashtags':
			return renderEntityHashtag(data);
		case 'urls':
			return renderEntityUrl(data);
		default:
			return null;
	}
}

export default function render(tweet) {
	const { text, entities = { } } = tweet;
	const replacements = [];

	Object.keys(entities).forEach(entityKey => {
		replacements.push(
			...entities[entityKey].map(entity => [
				renderEntity(entityKey, entity),
				entity.indices[0],
				entity.indices[1]
			])
		);
	});

	if (0 === replacements.length) {
		return escapeMarkdown(tweet.text);
	}

	let lastPos = text.length;
	const parts = replacements.sort((a, b) => b[1] - a[1]).map(replacement => {
		let output = [replacement[0]];

		if (replacement[2] < lastPos) {
			output.push(
				escapeMarkdown(
					text.substr(
						replacement[2],
						lastPos - replacement[2]
					)
				)
			);
		}

		lastPos = replacement[1];

		return output.join('');
	});

	if (lastPos > 0) {
		parts.push(
			escapeMarkdown(
				text.substr(0, lastPos)
			)
		);
	}

	return parts.reverse().join('');
}
