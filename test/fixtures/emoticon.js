export const input = {
	text: "Testing emoticons 🌞 with links http://t.co/AOZu04FpJG",
	entities:  {
		urls: [ {
			"url": "http://t.co/AOZu04FpJG",
			"expanded_url": "http://twitter.com",
			"display_url": "twitter.com",
			"indices": [31, 53]
		} ]
	}
}

export const output = 'Testing emoticons 🌞 with links [twitter.com](http://t.co/AOZu04FpJG "http://twitter.com")';
