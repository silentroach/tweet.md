import fs from 'fs';
import path from 'path';
import assert from 'assert';

// testing es6 version
import render from '../index';

describe('Renderer', () => {

	describe('Fixtures', () => {

		const fixturesPath = path.resolve(__dirname, 'fixtures');

		fs.readdirSync(fixturesPath).forEach(filename => {
			const filepath = path.resolve(fixturesPath, filename);

			it(filename, () => {
				const data = require(filepath);

				assert.equal(render(data.input), data.output);
			});
		});

	});

});
