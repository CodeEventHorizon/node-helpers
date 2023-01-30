// Requiring ObjectId from mongoose npm package
const ObjectId = require("mongoose").Types.ObjectId;

// Validator function
function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    }
    return false;
  }
  return false;
}

// Loading testcases into array
const testStrings = [
  "594ced02ed345b2b049222c5",
  "tests",
  "toptoptoptop",
  "testtesttest",
];

// Validating each test case
for (const testcase of testStrings) {
  if (isValidObjectId(testcase)) {
    console.log(testcase + " is a valid Mongodb ObjectId");
  } else {
    console.log(testcase + " is not a valid Mongodb ObjectId");
  }
}
