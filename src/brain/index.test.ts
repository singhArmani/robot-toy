import { Point, SquareTable } from "../shape";
import { Brain, directions, rotations } from "./";

describe("Brain", () => {
  const shapeToRoamOn = new SquareTable(5);
  const brain = new Brain(shapeToRoamOn);
  it("should create an instance of Brain class", () => {
    expect(brain).toBeInstanceOf(Brain);
  });

  describe("Known commands", () => {
    const VALID_COMMANDS = [
      "LEFT",
      "RIGHT",
      "MOVE",
      "REPORT",
      "PLACE 5,8,SOUTH",
      "PLACE 5,8,WEST",
      "PLACE 5,8,NORTH",
      "PLACE 5,8,EAST",
    ];

    VALID_COMMANDS.forEach((command) => {
      it(`should return true if command is known: ${command}`, () => {
        VALID_COMMANDS.forEach((command) => {
          const isCommandKnown = brain.isCommandKnown(command);
          expect(isCommandKnown).toEqual(true);
        });
      });
    });
  });

  describe("Unknown commands", () => {
    const INVALID_COMMANDS = [
      "FOO",
      "LEFT FOO",
      "PLACE",
      "PLACE SOUTH",
      "PLACE NORTH,1,2",
      "PLACE 1,2",
      "SOUTH PLACE 1,2",
    ];
    INVALID_COMMANDS.forEach((command) => {
      it(`should return false if command is unknown: ${command}`, () => {
        const isCommandKnown = brain.isCommandKnown(command);
        expect(isCommandKnown).toEqual(false);
      });
    });
  });

  describe("Future move commands", () => {
    it(`should increment y by one unit when direction is: ${directions.NORTH}`, () => {
      const currentLocation = {
        position: new Point(5, 5),
        direction: directions.NORTH,
      };
      const futurePosition = brain.getFutureMovePosition(currentLocation);
      expect(futurePosition).toMatchObject({ x: 5, y: 6 });
    });

    it(`should decrement y by one unit when direction is: ${directions.SOUTH}`, () => {
      const currentLocation = {
        position: new Point(5, 5),
        direction: directions.SOUTH,
      };
      const futurePosition = brain.getFutureMovePosition(currentLocation);
      expect(futurePosition).toMatchObject({ x: 5, y: 4 });
    });

    it(`should increment x by one unit when direction is: ${directions.EAST}`, () => {
      const currentLocation = {
        position: new Point(5, 5),
        direction: directions.EAST,
      };
      const futurePosition = brain.getFutureMovePosition(currentLocation);
      expect(futurePosition).toMatchObject({ x: 6, y: 5 });
    });
    it(`should decrement x by one unit when direction is: ${directions.WEST}`, () => {
      const currentLocation = {
        position: new Point(5, 5),
        direction: directions.WEST,
      };
      const futurePosition = brain.getFutureMovePosition(currentLocation);
      expect(futurePosition).toMatchObject({ x: 4, y: 5 });
    });
  });

  describe("Future rotations commands", () => {
    const ROTATIONS = [
      { d: directions.NORTH, r: rotations.LEFT, expected: directions.WEST },
      { d: directions.NORTH, r: rotations.RIGHT, expected: directions.EAST },
      { d: directions.SOUTH, r: rotations.LEFT, expected: directions.EAST },
      { d: directions.SOUTH, r: rotations.RIGHT, expected: directions.WEST },
      { d: directions.EAST, r: rotations.LEFT, expected: directions.NORTH },
      { d: directions.EAST, r: rotations.RIGHT, expected: directions.SOUTH },
      { d: directions.WEST, r: rotations.RIGHT, expected: directions.NORTH },
      { d: directions.WEST, r: rotations.LEFT, expected: directions.SOUTH },
    ];

    ROTATIONS.forEach(({ d, r, expected }) => {
      it(`should rotate to correct direction: previous: ${d}, rotation: ${r}, new: ${expected} `, () => {
        const newDirection = brain.getFutureDirection(d, r);
        expect(newDirection).toEqual(expected);
      });
    });
  });

  describe("Execute commands", () => {
    const COMMANDS = ["MOVE", rotations.LEFT, rotations.RIGHT, "REPORT"];
    const robotCurrentLocation = {
      position: new Point(0, 0),
      direction: directions.NORTH,
    };

    COMMANDS.forEach((command) => {
      it(`should ignore ${command} if PLACE command hasn't been given yet`, () => {
        const location = brain.executeCommand(command, null);
        expect(location).toEqual(undefined);
      });
    });

    it("should ignore the PLACE command if it's outside the shape's boundary", () => {
      const location1 = brain.executeCommand(
        "PLACE 0,-1,NORTH",
        robotCurrentLocation
      );
      expect(location1).toBeUndefined();
      const location2 = brain.executeCommand("PLACE 5 6", robotCurrentLocation);
      expect(location2).toBeUndefined();
    });

    it("should return a new location when PLACE command is valid", () => {
      const location1 = brain.executeCommand(
        "PLACE 0,1,NORTH",
        robotCurrentLocation
      );
      expect(location1).not.toBeUndefined();
      expect(location1).toMatchObject({
        position: { x: 0, y: 1 },
        direction: directions.NORTH,
      });

      const location2 = brain.executeCommand(
        "PLACE 4,1,WEST",
        robotCurrentLocation
      );
      expect(location2).not.toBeUndefined();
      expect(location2).toMatchObject({
        position: { x: 4, y: 1 },
        direction: directions.WEST,
      });
    });
  });
  describe("Pot holes on the table", () => {
    it("should ignore the command if it's making robot go into a pot hole", () => {
      const shape = new SquareTable(5);
      shape.setPotHole(new Point(2, 3));

      const brain = new Brain(shape);
      const robotCurrentLocation = new Point(2, 2);
      const location = {
        position: robotCurrentLocation,
        direction: directions.NORTH,
      };

      const potCommand = "PLACE 2,3,NORTH";
      const newLocation = brain.executeCommand(potCommand, location);

      expect(newLocation).toBeUndefined();

      const newMove = brain.executeCommand("MOVE", location);

      expect(newMove).toBeUndefined();
    });
  });
});
