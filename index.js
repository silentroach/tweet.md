// U+1F300 to U+1F3FF
// U+1F400 to U+1F64F
// U+1F680 to U+1F6FF
const emoticonsRegexp = /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g;

function escapeMarkdownPart(input) {
	return [

		// escaping symbols: # * ( ) [ ] _ `
		[/([\#\*\(\)\[\]\_\`\\])/g, '\\$1'],

		// escaping less and more signs
		[/\</g, '&lt;'],
		[/\>/g, '&gt;'],

		// convert line break into markdown hardbrake
		[/\n/g, '  \n']

	].reduce((input, [replaceFrom, replaceTo]) => input.replace(replaceFrom, replaceTo), input);
}

function escapeMarkdown(input) {
	return escapeMarkdownPart(input)
		// escaping period after number at the string start
		.replace(/^(\d+)\./, '$1\\.');
}

function renderEntityMention(data) {
	return `[@${escapeMarkdownPart(data.screen_name)}](https://twitter.com/${data.screen_name} "${data.name}")`;
}

function renderEntityMedia(data) {
	return `[${escapeMarkdownPart(data.display_url)}](${data.url})`;
}

function renderEntityHashtag(data) {
	return `[#${escapeMarkdownPart(data.text)}](https://twitter.com/search?q=%23${data.text})`;
}

function renderEntitySymbol(data) {
	return `[$${escapeMarkdownPart(data.text)}](https://twitter.com/search?q=%23${data.text}&src=ctag)`;
}

function renderEntityUrl(data) {
	return `[${escapeMarkdownPart(data.display_url)}](${data.url} "${data.expanded_url}")`;
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
		case 'symbols':
			return renderEntitySymbol(data);
		default:
			return null;
	}
}

export default function render(tweet) {
	let { text } = tweet;
	const { entities = { } } = tweet;
	const replacements = [];
	const emoticons = [];

	Object.keys(entities).forEach(entityKey => {
		replacements.push(
			...entities[entityKey]
				.map(entity => [
					renderEntity(entityKey, entity),
					entity.indices[0],
					entity.indices[1]
				])
				// do not add anything unknown
				.filter(data => null !== data[0])
		);
	});

	if (0 === replacements.length) {
		return escapeMarkdown(tweet.text);
	}

	// replacing two-byte emoticons with private use unicode symbol
	text = text.replace(emoticonsRegexp, match => {
		emoticons.push(match);
		return '\u0091';
	});

	let lastPos = text.length;
	const parts = replacements.sort((a, b) => b[1] - a[1]).map(replacement => {
		let output = [replacement[0]];

		if (replacement[2] < lastPos) {
			output.push(
				escapeMarkdownPart(
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

	return parts
		.reverse()
		.join('')
		// bringing back emoticons
		.replace(/\u0091/g, () => {
			return emoticons.shift();
		});
}
