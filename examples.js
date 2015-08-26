import fs from 'fs';
import path from 'path';

import render from './index';

const readmePath = path.resolve(__dirname, 'README.md');
const examplesPath = path.resolve(__dirname, 'examples');
const splitter = '<!-- CUT -->';

const examplesData = fs.readdirSync(examplesPath).map(filename => {
	const examplePath = path.resolve(examplesPath, filename);
	const relativePath = path.relative(__dirname, examplePath);

	const tweetData = JSON.parse(
		fs.readFileSync(examplePath, {
			encoding: 'utf-8'
		})
	);

	return `### ${filename}](${relativePath})

Tweet [${tweetData['id_str']}](https://twitter.com/${tweetData.user['screen_name']}/status/${tweetData['id_str']}) by ${tweetData.user.name}

${render(tweetData)}
`;
}).join('\n');

const [heading] = fs.readFileSync(readmePath, {
	encoding: 'utf-8'
}).split(splitter);

fs.writeFileSync(readmePath, `${heading}${splitter}

${examplesData}
`);
