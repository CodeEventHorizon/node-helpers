import bcrypt from "bcrypt";
import joi from "joi";

export const hashPassword = async (password) => {
  const salt = await new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      resolve(salt);
    });
  });
  return bcrypt.hash(password, salt);
};

export const compareThePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};

export const validEmail = (email) => {
  const schema = joi.string().email({ minDomainSegments: 2 }).required();
  return !joi.validate(email, schema).error;
};

export const validPassword = async (password) => {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(password);
};

export const isPasswordInBlacklist = (password) => {
  // you need to implement a function or data structure that checks
  // if the password is in a blacklist of common/weak passwords
  // here's an example with an array, but this is not a very efficient way
  // to check the blacklist. There are other options, like a set data structure,
  // a trie, a hash table, etc.
  const passwordBlacklist = ["password", "1234", "qwerty", "admin"];
  return passwordBlacklist.includes(password);
};

export const isPasswordWeak = (password) => {
  let strength = 0;
  let hasLowercase = false;
  let hasUppercase = false;
  let hasNumber = false;
  let hasSpecialChar = false;

  // Check if password has a lowercase letter
  if (/[a-z]/.test(password)) {
    strength += 1;
    hasLowercase = true;
  }

  // Check if password has an uppercase letter
  if (/[A-Z]/.test(password)) {
    strength += 1;
    hasUppercase = true;
  }

  // Check if password has a number
  if (/\d/.test(password)) {
    strength += 1;
    hasNumber = true;
  }

  // Check if password has a special character
  if (/[!@#$%^&*]/.test(password)) {
    strength += 1;
    hasSpecialChar = true;
  }

  // Check length of password
  if (password.length >= 8) {
    strength += 1;
  }

  return strength < 3;
};
