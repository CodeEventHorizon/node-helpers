// Requiring module
const fs = require("fs");

// Accessing arguments
const args = process.argv;

// The "index.js" is 8 character long
// so -8 removes last 8 characters
const currentWorkingDirectory = args[1].slice(0, -8);

// Check if "todo.txt" & "done.txt" don't exist and creating them
if (fs.existsSync(currentWorkingDirectory + "todo.txt") === false) {
  let createStream = fs.createWriteStream("todo.txt");
  createStream.end();
}
if (fs.existsSync(currentWorkingDirectory + "done.txt") === false) {
  let createStream = fs.createWriteStream("done.txt");
  createStream.end();
}

// Display the usage format.
const InfoFunction = () => {
  const UsageText = `
  Usage:-
  $ node index.js add "todo item"   # Add a new todo
  $ node index.js ls                # Show remaining todos
  $ node index.js del NUMBER        # Delete a todo
  $ node index.js done NUMBER       # Complete a todo
  $ node index.js help              # Show usage
  $ node index.js report            # Statistics
  `;
  console.log(UsageText);
};

// Read the data from "todo.txt" and display them with a corresponding number
// Most recent is displayed on the top with the largest number
const listFunction = () => {
  // Create an empty array
  let data = [];

  // Read from todo.txt and convert it into a String
  const fileData = fs
    .readFileSync(currentWorkingDirectory + "todo.txt")
    .toString();

  // Split the string and store into array
  data = fileData.split("\n");

  // Filter the string for any empty lines in the file
  let filterData = data.filter(function (value) {
    return value !== "";
  });

  if (filterData.length === 0) {
    console.log("There are no pending todos!");
  }

  for (let i = 0; i < filterData.length; i++) {
    console.log(filterData.length - i + ". " + filterData[i]); //
  }
};

// Read the conrent from todo.txt, and the new todo, then rewrite it in todo.txt
const addFunction = () => {
  // New todo string argument is stored
  const newTask = args[3];

  // If argument is passed
  if (newTask) {
    // Create an empty array
    let data = [];

    // Read the data from file todo.txt and
    // convert it in string
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();

    // New task is added to previous data
    fs.writeFile(
      currentWorkingDirectory + "todo.txt",
      newTask + "\n" + fileData,
      function (err) {
        // Handle if there is any error
        if (err) throw err;

        // Logs the new task added
        console.log('Added todo: "' + newTask + '"');
      }
    );
  } else {
    // if argument was not passed
    console.log("Error: Missing todo string. Nothing added!");
  }
};

// Read the data from todo.txt, remove corresponding task,
// and re-write the data in a file
const deleteFunction = () => {
  // Store which index is passed
  const deleteIndex = args[3];

  // If index is passed
  if (deleteIndex) {
    // Create an empty array
    let data = [];

    // Read the data from file and convert
    // it into string
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();

    data = fileData.split("\n");
    let filterData = data.filter(function (value) {
      // Filter the data for any empty lines
      return value !== "";
    });

    // If delete index is greater than no. of task
    // or less than zero
    if (deleteIndex > filterData.length || deleteIndex <= 0) {
      console.log(
        "Error: todo #" + deleteIndex + " does not exist. Nothing deleted."
      );
    } else {
      // Remove the task
      filterData.splice(filterData.length - deleteIndex, 1);

      // Join the array to form a string
      const newData = filterData.join("\n");

      // Write the new data back in file
      fs.writeFile(
        currentWorkingDirectory + "todo.txt",
        newData,
        function (err) {
          if (err) throw err;

          // Logs the deleted index
          console.log("Deleted todo #" + deleteIndex);
        }
      );
    }
  } else {
    // Index argument was no passed
    console.log("Error: Missing NUMBER for deleting todo.");
  }
};

// read data from todo.txt,
// split it into an array,
// store the task to be marked as done
// delete it from todo.txt,
// re-write the data back to todo.txt
// Now we will write the deleted task we stored along with the current date in done.txt
const doneFunction = () => {
  // Store the index passed as argument
  const doneIndex = args[3];

  // If argument is passed
  if (doneIndex) {
    // Empty array
    let data = [];

    // Create a new date object
    let dataobj = new Date();

    // Convert it to string and slice only the
    // date part, removing the time part
    let dateString = dataobj.toISOString().substring(0, 10);

    // Read the data from todo.txt
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();

    // Read the data from done.txt
    const doneData = fs
      .readFileSync(currentWorkingDirectory + "done.txt")
      .toString();

    // Split the todo.txt data
    data = fileData.split("\n");

    // Filter for any empty lines
    let filterData = data.filter(function (value) {
      return value !== "";
    });

    // If done index is greater than no. of task or <= 0
    if (doneIndex > filterData.length || doneIndex <= 0) {
      console.log("Error: todo #" + doneIndex + " does not exist");
    } else {
      // Delete the task from todo.txt data and store it
      const deleted = filterData.splice(filterData.length - doneIndex, 1);

      // Join the array to create a string
      const newData = filterData.join("\n");

      // Write back the data in todo.txt
      fs.writeFile(
        currentWorkingDirectory + "todo.txt",
        newData,
        function (err) {
          if (err) throw err;
        }
      );

      // Write the stored task in done.txt
      // along with date string
      fs.writeFile(
        currentWorkingDirectory + "done.txt",
        "x " + dateString + " " + deleted + "\n" + doneData,
        function (err) {
          if (err) throw err;
          console.log("Marked todo #" + doneIndex + " as done.");
        }
      );
    }
  } else {
    // if argument was not passed
    console.log("Error: Missing NUMBER for marking todo as done.");
  }
};

// read data from todo.txt and done.txt
// calculate the number of tasks in each
// and display how many tasks are completed and how many are pending
const reportFunction = () => {
  // Create empty array for data of todo.txt
  let todoData = [];

  // Create empty array for data of done.txt
  let doneData = [];

  // Create a new date object
  let dataobj = new Date();

  // Slice the date part
  let dateString = dataobj.toISOString().substring(0, 10);

  // Read data from both the files
  const todo = fs.readFileSync(currentWorkingDirectory + "todo.txt").toString();
  const done = fs.readFileSync(currentWorkingDirectory + "done.txt").toString();

  // Split the data from both files
  todoData = todo.split("\n");
  doneData = done.split("\n");

  let filterTodoData = todoData.filter(function (value) {
    return value !== "";
  });
  let filterDoneData = doneData.filter(function (value) {
    // Filter both the data for empty lines
    return value !== "";
  });

  console.log(
    dateString +
      " " +
      "Pending : " +
      filterTodoData.length +
      " Completed : " +
      filterDoneData.length
    // Log the stats calculated
  );
};

switch (args[2]) {
  case "add": {
    addFunction();
    break;
  }
  case "ls": {
    listFunction();
    break;
  }
  case "del": {
    deleteFunction();
    break;
  }
  case "done": {
    doneFunction();
    break;
  }
  case "help": {
    InfoFunction();
    break;
  }
  case "report": {
    reportFunction();
    break;
  }
  default: {
    InfoFunction();
    // We will display help when no
    // argument is passed or invalid
    // argument is passed
  }
}
