export const input = {
	text: '`some(@_h4_);` done',
	entities: {
		hashtags: [],
		symbols: [],
		user_mentions: [ {
			'screen_name': '_h4_',
			'name': 'Наполеон Бонапарт',
			'id': 15020265,
			'id_str': '15020265',
			'indices': [6, 11]
		}],
		urls: []
	}
}

export const output = '\\`some\\([@\\_h4\\_](https://twitter.com/_h4_ \"Наполеон Бонапарт\")\\);\\` done';
