var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
   name: { type: String, required: true },
   provider: { type: String, required: true },
   provider_id: { type: String, requited: true },
   photo: { type: String, required:true },
   rsvps: [{ 
       business: { type: String, required: true },
       date: { type: Date, required: true }
   }]
});

module.exports = mongoose.model("User", schema);