const { date } = require("joi");
const mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title: { type: String, require:true, unique:true },
  description:{type: String},
  author:{type: String},
  state: { type: String, value: ["draft", "published"], default:"draft" },
  read_count:{type: Number},
  reading_time:{type: String},
  tag:{type: String},
  body:{type: String, requred:true},
  drafted_timestamp:{type: Date},
  published_timestamp:{type: Date},
  user_id:[{type:Schema.Types.ObjectId, ref:"users"}]
});


module.exports = mongoose.model("blogs", blogSchema);