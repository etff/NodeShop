var crypto = require("crypto");
var mysalt = "encodeValue";

module.exports = function(password) {
    return crypto.createHash("sha512").update( password + mysalt ).digest("base64");
};