var jsonfile = require('jsonfile');

module.exports = {
  read: function(file) {
    return jsonfile.readFileSync(file);
  },
  write: function(file, data) {
    jsonfile.writeFileSync(file, data);
  }
};