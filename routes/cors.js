const cors = require('cors');
const whitelist = ['http:localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback)=>{
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOption = {origin: true};
    }
    else{
        corsOption = {origin: false};
    }
    callback(null, corsOption);
}

exports.cors = cors(); //allows cors for all origins - simple request
exports.corsWithOptions = cors(corsOptionsDelegate);  //request options