const express = require('express');
const path = require('path');
const app = express();

// ----------------------------------imports
require("./db/conn");
const { Lands, users, blocks, publicprivate } = require("./models/schema");

const { request, METHODS } = require('http');
const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../views");

// express definitions
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", views_path);

// ---------------------------------------------Pages
app.get("/", (req, res) => { })
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'userregister.html'));
})
app.get("/landregister", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'landregister.html'));
})
app.get("/landsend", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'landsend.html'));
})
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
})
app.get("/api", (req, res) => {
    apifunction = async () => {
        data = await blocks.find();
        res.send(data);
    }
    apifunction();
})
app.get("/publicprivate", (req, res) => {
    tempfunction = async () => {
        data = await publicprivate.find();
        res.send(data);
    }
    tempfunction();
})

app.post("/landregister", async (req, res) => {
    try {
        var { publickey, landvector, proof } = req.body;
        var usersdata = await users.findOne({ publickey });
        if (usersdata) {
            var hash = await newhash();
            var landid = await newlandid();
            var time = await newtime();
            var lastblock = 1;
            var Latestblock = await blocks.findOneAndUpdate({ lastblock }, { $unset: { lastblock: "" } })
            oldhash = Latestblock.hash;
            var register = new blocks({
                oldhash: oldhash,
                hash: hash,
                publickey: publickey,
                landid: landid,
                time: time,
                lastblock: "1",
            })
            const registerconfirmed = await register.save();
            var landcapture = new Lands({
                landid: landid,
                landvector: landvector,
                proof: proof,
                time: time
            })
            const landcapturesuccess = await landcapture.save();
            res.send('We will reach out you soon with your email, Now You can go Back 😊😊😊😊');
        } else {
            res.redirect('/register');
        }
    } catch (error) {
        console.log(error);
    }
})
app.post("/register", async (req, res) => {
    try {
        var { email, proof } = req.body;
        const publickey = await newpublickey();
        var time = await newtime();
        var userregistration = new users({
            email: email,
            proof: proof,
            publickey: publickey,
            time: time
        })
        const userregconfirmed = await userregistration.save();
        const privatekey = await newprivatekey();
        var pblkprvt = new publicprivate({
            publickey, privatekey
        })
        const publicprivatefinal = await pblkprvt.save();

        res.redirect('/landregister');
    } catch (error) {
        console.log(error);
    }
})

app.post("/landsend", async (req, res) => {
    try {
        var { receiverpublickey, publickey, landid, privatekey } = req.body;
        var blockdata = await publicprivate.findOne({ publickey, privatekey });
        var landfind = await blocks.find({ landid });
        let landcount = 0;
        while (landcount < landfind.length) {
            var final = landfind[landcount];
            landcount++;
        }
        var ownerofland = final.publickey;
        if (!landfind) {
            res.redirect('/landregister');
        } else if (!blockdata) {
            res.redirect('/landsend');
        } else if (ownerofland != publickey) {
            res.send('Sorry You are not the owner of this Land');
        } else {
            var hash = await newhash();
            var time = await newtime();
            var lastblock = 1;
            var Latestblock = await blocks.findOneAndUpdate({ lastblock }, { $unset: { lastblock: "" } })
            oldhash = Latestblock.hash;
            var send = new blocks({
                oldhash: oldhash,
                hash: hash,
                publickey: receiverpublickey,
                senderpublickey: publickey,
                landid: landid,
                time: time,
                lastblock: "1",
            })
            const sendconfirmed = await send.save();
            res.send('Your Land is now sent to the ' + publickey + '😊😊😊😊');
        }
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
});

let some = 0;

//Functions.............

function generatekey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

async function newhash() {
    const length = 100;
    result = generatekey(length);
    var blockdata = await blocks.findOne({ hash: result })
    while (blockdata) {
        result = await newhash();
        blockdata = null;
    }
    return result;
}

async function newpublickey() {
    const length = 35;
    result = generatekey(length);
    var blockdata = await users.findOne({ publickey: result })
    while (blockdata) {
        result = await newpublickey();
        blockdata = null;
    }
    return result;
}
async function newprivatekey() {
    const length = 60;
    result = generatekey(length);
    var blockdata = await publicprivate.findOne({ privatekey: result })
    while (blockdata) {
        result = await newprivatekey();
        blockdata = null;
    }
    return result;
}
async function newlandid() {
    const length = 10;
    result = generatekey(length);
    var blockdata = await Lands.findOne({ landid: result })
    while (blockdata) {
        result = await newprivatekey();
        blockdata = null;
    }
    return result;
}

async function newtime() {
    var date = new Date();
    const currenttimefinal = date.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', });

    return currenttimefinal
}
// newprivatekey().then(result => {
//     console.log(result);
// }).catch(error => {
//     console.error(error);
// });