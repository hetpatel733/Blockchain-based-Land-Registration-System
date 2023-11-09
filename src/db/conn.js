const { connect } = require('http2');
const mongoose = require('mongoose');
const pass = encodeURIComponent("hetpatel");
const URI = "mongodb+srv://hetpatel:hetpatel@cluster0.kmj1jl3.mongodb.net/Landdata?retryWrites=true&w=majority";
function mongooconnect() {
    mongoose.connect(URI, {
        useNewUrlParser: true,
        UseUnifiedTopology: true,
    }
    ).then(() => {
        console.log("Connection Success");
    }).catch((e) => {
        console.log(e);
    })
}
mongooconnect();