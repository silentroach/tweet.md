export const input = {
	text: 'RT @miripiruni: #TIL #nodejs http://t.co/VXj36cneyb',
	entities: {
		hashtags: [ {
			'text': 'TIL',
			'indices': [16, 20]
		}, {
			'text': 'nodejs',
			'indices': [21, 28]
		} ],
		user_mentions: [ {
			'screen_name': 'miripiruni',
			'name': 'Slava Oliyanchuk',
			'id': 10692322,
			'id_str': '10692322',
			'indices': [3, 14]
		} ],
		media: [ {
			'id': 615450607734890500,
			'id_str': '615450607734890496',
			'indices': [29, 51],
			'media_url': 'http://pbs.twimg.com/media/CIqFESLWIAA8Qcz.png',
			'media_url_https': 'https://pbs.twimg.com/media/CIqFESLWIAA8Qcz.png',
			'url': 'http://t.co/VXj36cneyb',
			'display_url': 'pic.twitter.com/VXj36cneyb',
			'expanded_url': 'http://twitter.com/miripiruni/status/615450610914213888/photo/1',
			'type': 'photo',
			'sizes': {
				'thumb': {
					'w': 150,
					'h': 150,
					'resize': 'crop'
				},
				'large': {
					'w': 1024,
					'h': 357,
					'resize': 'fit'
				},
				'medium': {
					'w': 600,
					'h': 209,
					'resize': 'fit'
				},
				'small': {
					'w': 340,
					'h': 118,
					'resize': 'fit'
				}
			},
			'source_status_id': 615450610914213900,
			'source_status_id_str': '615450610914213888',
			'source_user_id': 10692322,
			'source_user_id_str': '10692322'
		} ]
	}
};

export const output = 'RT [@miripiruni](https://twitter.com/miripiruni "Slava Oliyanchuk"): [#TIL](https://twitter.com/search?q=%23TIL) [#nodejs](https://twitter.com/search?q=%23nodejs) [pic.twitter.com/VXj36cneyb](http://t.co/VXj36cneyb)';
