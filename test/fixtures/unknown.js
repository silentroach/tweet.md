export const input = {
	text: 'Tweet data with some unknown entities will not break the text',
	entities: {
		unknown: [
			{
				indices: [0, 10]
			}
		]
	}
}

export const output = 'Tweet data with some unknown entities will not break the text';
