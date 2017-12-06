const {
	parse: parseUrl,
	format: formatUrl
} = require('url');

const EmoticonsRegexp = require('emoji-regex')();
const TwitterStatusIdRegexp = /\/status\/(\w+)$/;

const TwitterHost = 'twitter.com';
const TwitterUrlParsed = parseUrl(`https://${TwitterHost}`);

function getTwitterUrl(pathname, query) {
	return formatUrl(
		Object.assign(TwitterUrlParsed, {
			pathname, query
		})
	);
}

function getTwitterHashUrl(query, source) {
	const parameters = {q: `#${query}`};
	if (undefined !== source) {
		parameters.src = source;
	}

	return getTwitterUrl('search', parameters);
}

function escapeMarkdownPart(input) {
	return [

		// escaping symbols: # * ( ) [ ] _ `
		[/([\#\*\(\)\[\]\_\`\\])/g, '\\$1'],

		// escaping less and more signs
		[/\</g, '&lt;'],
		[/\>/g, '&gt;'],

		// convert line break into markdown hardbrake
		[/\n/g, '  \n']

	].reduce(
		(input, [replaceFrom, replaceTo]) => input.replace(replaceFrom, replaceTo),
		input
	);
}

function escapeMarkdown(input) {
	return escapeMarkdownPart(input)
		// escaping period after number at the string start
		.replace(/^(\d+)\./, '$1\\.');
}

function renderQuote(data) {
	const content = module.exports(data)
		.split('\n')
		.map(row => `> ${row}`)
		.join('\n');

	return `
${content}`;
}

function renderEntityMention(data) {
	const url = getTwitterUrl(data.screen_name);

	return `[@${escapeMarkdownPart(data.screen_name)}](${url} "${data.name}")`;
}

function renderEntityMedia(data) {
	return `[${escapeMarkdownPart(data.display_url)}](${data.url})`;
}

function renderEntityHashtag(data) {
	const url = getTwitterHashUrl(data.text);

	return `[#${escapeMarkdownPart(data.text)}](${url})`;
}

function renderEntitySymbol(data) {
	const url = getTwitterHashUrl(data.text, 'ctag');

	return `[$${escapeMarkdownPart(data.text)}](${url})`;
}

function renderEntityUrl(data) {
	return `[${escapeMarkdownPart(data.display_url)}](${data.url} "${data.expanded_url}")`;
}

function renderEntity(type, data) {
	if (data.skip) return;

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

function processText(original, replacements) {
	// replacing two-byte emoticons with private use unicode symbol
	const emoticons = [];
	const text = original.replace(EmoticonsRegexp, match => {
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
		.replace(/\u{0091}/ug, () => {
			return emoticons.shift();
		});
}

function getStatusIdFromUrlEntity(entity) {
	const {expanded_url: url} = entity;
	if (!url) return;

	const parsed = parseUrl(url);
	if (!parsed || TwitterHost !== parsed.hostname) return;

	const statusMatch = parsed.path.match(TwitterStatusIdRegexp);
	return statusMatch && statusMatch[1];
}

module.exports = function(tweet = { }) {
	const source = tweet.extended_tweet || tweet;

	const entities = Object.assign({ }, source.entities);
	let { text = '' } = source;

	if (source.full_text) {
		text = source.full_text;
	}

	const { quoted_status: quote } = source;

	const replacements = [];
	Object.keys(entities).forEach(entityKey => {
		const entityList = entities[entityKey];

		// we should skip last link if it is a quote link
		if (quote
			&& 'urls' === entityKey
			&& entityList.length > 0
		) {
			const lastLink = entityList[entityList.length - 1];

			if (getStatusIdFromUrlEntity(lastLink) === quote.id_str) {
				lastLink.skip = true;
			}
		}

		replacements.push(
			...entityList
				.map(entity => [
					renderEntity(entityKey, entity),
					entity.indices[0],
					entity.indices[1]
				])
				// do not add anything unknown
				.filter(data => null !== data[0])
		);
	});

	const output = 0 === replacements.length
		? escapeMarkdown(text)
		: processText(text, replacements);

	return [output, quote && renderQuote(quote)]
		.filter(Boolean)
		.join('\n');
}
