const randomstring = require("randomstring");

const CharacterGenerator = {
	userIdGenerator(name) {
		let difference, nameString;
		if (name.length < 4) {
			difference = 4 - name.length;
			const patch = randomstring.generate({charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', length: parseInt(difference)});
			nameString = `${name}${patch}`
		} else {
			nameString = name.substring(0, 3);
		}
		const generatedSuffix = randomstring.generate({charset: 'numeric', length: 5});
		return `${nameString.toUpperCase()}${generatedSuffix}`;
	}
}


module.exports = CharacterGenerator;
