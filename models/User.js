const {Schema, model, Types} = require("mongoose")

const schema = new Schema({
    firstName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    notes: [{ type: Types.ObjectId, ref:"Note" }]
})

module.exports = model("User", schema)