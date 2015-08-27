export const input = {
	text: '`some(code);` @_h4_ done',
	entities: {
		hashtags: [],
		symbols: [],
		user_mentions: [ {
			'screen_name': '_h4_',
			'name': 'Наполеон Бонапарт',
			'id': 15020265,
			'id_str': '15020265',
			'indices': [14, 19]
		}],
		urls: []
	}
}

export const output = '`some(code);` [@\\_h4\\_](https://twitter.com/_h4_ \"Наполеон Бонапарт\") done';
