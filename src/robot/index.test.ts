import { Brain, directions } from "../brain";
import { SquareTable } from "../shape";
import { Robot } from "./";

describe("Robot", () => {
  const brain = new Brain(new SquareTable(5));
  it("should create a Robot instance", () => {
    const robot = new Robot(brain);
    expect(robot).toBeInstanceOf(Robot);
    expect(robot.report()).toBeUndefined();
  });

  const COMMANDS1 = ["LEFT", "RIGHT", "REPORT", "PLACE 0,0,NORTH"];
  const COMMANDS2 = ["PLACE 0,0,NORTH", "LEFT", "RIGHT", "PLACE 4,5,WEST"];
  const COMMANDS3 = ["PLACE 0,1,NORTH", "LEFT", "LEFT", "PLACE 7,5,WEST"];
  const COMMANDS4 = [
    "PLACE 2,2,EAST",
    "LEFT",
    "LEFT",
    "PLACE 7,5,WEST",
    "PLACE 4,4,NORTH",
    "RIGHT",
    "REPORT",
  ];

  it("should place robot at valid location with given direction: ignore invalid commands", () => {
    const robot = new Robot(brain);
    COMMANDS1.forEach((command) => {
      robot.run(command);
    });

    const newLocation = robot.getLocation();
    expect(newLocation).not.toBeUndefined();
    expect(newLocation.direction).toEqual(directions.NORTH);
    expect(newLocation.position.x).toEqual(0);
    expect(newLocation.position.y).toEqual(0);
  });

  it("should place robot at valid location with given direction: non-destructive", () => {
    const robot = new Robot(brain);
    COMMANDS2.forEach((command) => {
      robot.run(command);
    });

    const newLocation = robot.getLocation();
    expect(newLocation).not.toBeUndefined();
    expect(newLocation.direction).toEqual(directions.WEST);
    expect(newLocation.position.x).toEqual(4);
    expect(newLocation.position.y).toEqual(5);
  });

  it("should place robot at valid location with given direction: destructive", () => {
    const robot = new Robot(brain);
    COMMANDS3.forEach((command) => {
      robot.run(command);
    });

    const newLocation = robot.getLocation();
    expect(newLocation).not.toBeUndefined();
    expect(newLocation.direction).toEqual(directions.SOUTH);
    expect(newLocation.position.x).toEqual(0);
    expect(newLocation.position.y).toEqual(1);
  });

  it("should place robot at valid location with given direction: mixed", () => {
    const robot = new Robot(brain);
    COMMANDS4.forEach((command) => {
      robot.run(command);
    });

    const newLocation = robot.getLocation();
    expect(newLocation).not.toBeUndefined();
    expect(newLocation.direction).toEqual(directions.EAST);
    expect(newLocation.position.x).toEqual(4);
    expect(newLocation.position.y).toEqual(4);
  });
});
