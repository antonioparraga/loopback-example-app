'use strict';

module.exports = {

  validatePhone: function(phone) {

    var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

    if(typeof phone === "undefined") {
      return true;
    }
    else {
      var phoneNumber = phoneUtil.parse(phone, 'ES');
      return phoneUtil.isValidNumber(phoneNumber);
    }
  },

  normalizePhone: function(phone) {
    return phone;
  }

};



