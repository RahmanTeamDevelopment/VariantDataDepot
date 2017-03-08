fs = require('fs');
process = require('process');

args = process.argv.slice(2);
file_name = args[0]

console.log("Reading VCF data from file " + file_name);

fs.readFile(file_name,
		'utf-8',
		function (err, data) {
	if (err) {
		return console.log(err);
	}
	
	console.log(data);
});
