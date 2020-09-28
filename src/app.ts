#!/usr/bin/env node
import inquirer from "inquirer";
import { Brain } from "./brain";
import { SquareTable } from "./shape";
import { Robot } from "./robot";

const brain = new Brain(new SquareTable(5));
const robot = new Robot(brain);

// Pick an approach to give commands/s to our robot
const pickCommandQuestions = [
  {
    type: "list",
    name: "command",
    message: "Pick an option to give command/s to your robot 🤖:",
    choices: [
      "Single command",
      "Provide a txt file containing multiple commands",
    ],
  },
];

// Pick a single command for our robot to execute
const typeCommandQuestions = [
  {
    type: "input",
    name: "input",
    message: "Please type a command for your robot:",
  },
  {
    type: "confirm",
    name: "askAgain",
    message: "Want to enter another command? (Just hit enter for YES)",
    default: true,
  },
];

// Run commands to robot via txt file
const fileNameQuestions = [
  {
    type: "input",
    name: "fileName",
    message:
      "Please provide a file name containing commands (Just hit enter to pick a default txt file)",
    default: () => "commands.txt",
  },
];

inquirer.prompt(pickCommandQuestions).then((answers) => {
  if (answers["command"] === "Single command") {
    askSingleCommand();
  } else {
    askFileName();
  }
});

// To recursively ask user to give more commands to our robot
const askSingleCommand = () => {
  inquirer.prompt(typeCommandQuestions).then((answers) => {
    // Let robot execute that command (input)
    robot.run(answers["input"]);
    if (answers.askAgain) {
      askSingleCommand();
    } else {
      console.log("Exiting Now... 👋");
    }
  });
};

const askFileName = () => {
  inquirer
    .prompt(fileNameQuestions)
    .then((answers) => {
      robot.runCommandsFromFile(answers["fileName"]);
    })
    .catch((err) => {
      console.log("Error occured: ", err);
    });
};
