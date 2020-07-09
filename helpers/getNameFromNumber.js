const phonebook = require('../client/src/phonebook')
module.exports = 
    function (value)  {
        return Object.keys(phonebook).find((key) => phonebook[key]['number'] == value);
      }
