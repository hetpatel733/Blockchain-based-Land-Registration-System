const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },
    landid: {
        type: String,
        required: false
    },
    landvector: {
        type: String,
        required: false
    },
    proof: {
        type: String,
        required: false
    },
    publickey: {
        type: String,
        required: false
    },
    senderpublickey: {
        type: String,
        required: false
    },
    privatekey: {
        type: String,
        required: false
    },
    hash: {
        type: String,
        required: false
    },
    oldhash: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: false
    },
    lastblock: {
        type: String,
        required: false
    }
});

const Lands = mongoose.model("Lands", Schema);
const users = mongoose.model("users", Schema);
const blocks = mongoose.model("blocks", Schema);
const publicprivate = mongoose.model("publicprivate", Schema);

module.exports = { Lands, users, blocks, publicprivate };