// @see https://en.wikipedia.org/wiki/Emoji
// 1F300..1F3FF  |  1F400..1F64F  |  1F680..1F6FF  |  2600..26FF  |  2700..27BF
const emoticonsRegexp = /[\u{1F300}-\u{1F3FF}]|[\u{1F400}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/ug;

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

function renderQuote(data, options) {
	return `
> ${module.exports(data.quoted_status, options)}`;
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

function renderEntityMediaEnhanced(data) {
	if (data.type === "photo") {
		return `[![${escapeMarkdownPart(data.ext_alt_text || data.display_url)}](${data.media_url_https})](${data.url} "${data.expanded_url}")`;
	}
	else if (data.type === "video") {
		const sources = data.video_info.variants.map((variant) => `<source src="${variant.url}" type="${variant.content_type}">`).join("");
		return `<video poster="${data.media_url_https}" controls>${sources}</video>`;
	}
	else if (data.type === "animated_gif") {
		const sources = data.video_info.variants.map((variant) => `<source src="${variant.url}" type="${variant.content_type}">`).join("");
		return `<video poster="${data.media_url_https}" autoplay loop muted>${sources}</video>`;
	}
}

function renderEntity(type, data, options) {
	const { enhancedMarkdown = false } = options;
	switch (type) {
		case 'user_mentions':
			return renderEntityMention(data);
		case 'media':
			if (enhancedMarkdown) {
				return renderEntityMediaEnhanced(data);
			}
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

module.exports = function(tweet = { }, options = { }) {
	let { text = '', entities = { } } = tweet;

	if (tweet.extended_entities && tweet.extended_entities.media.length) {
		entities.media = tweet.extended_entities.media;
	}

	if (tweet.extended_tweet) {
		text = tweet.extended_tweet.full_text;
		entities = tweet.extended_tweet.entities;
		if (tweet.extended_tweet.extended_entities && tweet.extended_tweet.extended_entities.media.length) {
			entities.media = tweet.extended_tweet.extended_entities.media;
		}
	}
	else if (tweet.full_text) {
		text = tweet.full_text;
	}

	const replacements = [];
	Object.keys(entities).forEach(entityKey => {
		replacements.push(
			...entities[entityKey]
				.map(entity => [
					renderEntity(entityKey, entity, options),
					entity.indices[0],
					entity.indices[1]
				])
				// do not add anything unknown
				.filter(data => null !== data[0])
		);
	});

	if (0 === replacements.length) {
		return escapeMarkdown(text);
	}

	// replacing two-byte emoticons with private use unicode symbol
	const emoticons = [];
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

	if (tweet.quoted_status) {
		// Remove the link to the quote before rendering the quote.
		//TODO should use display_text_range instead, which would also hide other URLs.
		parts.shift();
		parts.unshift(renderQuote(tweet, options));
	}

	return parts
		.reverse()
		.join('')
		// bringing back emoticons
		.replace(/\u{0091}/ug, () => {
			return emoticons.shift();
		});
}
