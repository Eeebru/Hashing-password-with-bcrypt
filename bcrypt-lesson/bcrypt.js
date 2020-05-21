const bcrypt = require("bcrypt");

const password = "eebru-eebru]g=";
const saltRounds = 10;

bcrypt
  .hash(password, saltRounds)
  .then((hashedPass) => {
  console.log("hashed>>>>", hashedPass)
  return hashedPass;
})
.then(hash => bcrypt.compare(password, hash))
.then(res => console.log('match', res))