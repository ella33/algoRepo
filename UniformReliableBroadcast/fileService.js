module.exports.FileService = FileService;

var jsonfile = require('jsonfile')

var FileService = {
	read: function(read) {
		return jsonfile.readFileSync(file);
	},
	write: function(file, data) {
		jsonfile.writeFileSync(file, data);
	}
};