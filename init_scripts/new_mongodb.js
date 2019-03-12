var mongoose = require('mongoose');

console.log("pre-connection");
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true },function(err){
	if(err){console.log("error connection");throw err;}
});

console.log("post-connection");
var schema_test = new mongoose.Schema({
	pseudo : String,
	description : String
});

console.log("post-schema creation");

var schema_test_model = mongoose.model('test_schema',schema_test);

console.log("post-model creation");
var new_entry = new schema_test_model({ pseudo : 'micra', description : 'la securite avant tout' });

console.log("new entry created");

new_entry.save(function (err){
	if (err) {console.log("error saving");throw err;}
	console.log('added with success');
	mongoose.connection.close();
});

console.log("end of init");
