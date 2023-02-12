const {Schema, model, Types} = require("mongoose")

const schema = new Schema({
    title: {type: String, default: ""},
    content: {type: String, default: ""},
    date: {type: Date, default: Date.now},
    owner: [{ type: Types.ObjectId, ref:"User" }]
})

module.exports = model("Note", schema)