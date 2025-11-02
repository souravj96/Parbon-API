const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const indianPhoneNumber = (value, helpers) => {
  // Indian phone number validation
  // Supports formats: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX (10 digits)
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  
  if (!phoneRegex.test(value)) {
    return helpers.message('phone must be a valid Indian phone number (10 digits starting with 6-9, optionally prefixed with +91 or 91)');
  }
  return value;
};

export { objectId, password, indianPhoneNumber };
