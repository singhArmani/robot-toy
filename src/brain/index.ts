import { Point, Shape } from "../shape";
import { Rotation, Direction, Location } from "./types";

export const directions = {
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  WEST: "WEST",
  EAST: "EAST",
} as const;

export const rotations = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

// Valid commands known to our robot's brain
const VALID_COMMANDS = ["LEFT", "RIGHT", "MOVE", "REPORT"];
const PLACE_COMMAND_REGEX = /^PLACE (?<x>-?\d),(?<y>-?\d),(?<direction>(EAST|WEST|NORTH|SOUTH))$/;

// Robot brain (which can be trained 😍)
// Handles if command given are valid;
// If yes, execute the command and change the state of our toy Robot (machine)
export class Brain {
  private readonly shapeToRoamOn: Shape;
  private readonly validCommands: string[] = VALID_COMMANDS;
  constructor(shapeToRoamOn: Shape) {
    this.shapeToRoamOn = shapeToRoamOn;
  }

  // Checks if command is a known command: LEFT, RIGHT, MOVE, REPORT, PLACE X,Y,F
  isCommandKnown(command: unknown): boolean {
    if (typeof command !== "string") return false;
    const matchObj = command.match(PLACE_COMMAND_REGEX);
    return Boolean(matchObj) || this.validCommands.includes(command);
  }

  // Get next position for the "MOVE" command
  getFutureMovePosition(currentLocation: Location): Point {
    const { position, direction } = currentLocation;
    switch (direction) {
      case directions.NORTH:
        return new Point(position.x, position.y + 1);
      case directions.SOUTH:
        return new Point(position.x, position.y - 1);
      case directions.EAST:
        return new Point(position.x + 1, position.y);
      case directions.WEST:
        return new Point(position.x - 1, position.y);
      default:
        return position;
    }
  }

  // Get new direction for the "LEFT" or "RIGHT" command
  getFutureDirection(
    currentDirection: Direction,
    rotation: Rotation
  ): Direction {
    switch (currentDirection) {
      case directions.NORTH:
        return rotation === rotations.LEFT ? directions.WEST : directions.EAST;
      case directions.SOUTH:
        return rotation === rotations.LEFT ? directions.EAST : directions.WEST;
      case directions.EAST:
        return rotation === rotations.LEFT
          ? directions.NORTH
          : directions.SOUTH;
      case directions.WEST:
        return rotation === rotations.LEFT
          ? directions.SOUTH
          : directions.NORTH;
      default:
        return currentDirection;
    }
  }

  // This will check if command is non-destructive.
  // We only cater for "MOVE" and "PLACE" command as they can cause our robot to fall off the table
  // For other commands, we just invoke it.
  // NOTE: if command if valid, will return the new location, undefined otherwise
  executeCommand(
    command: string,
    robotCurrentLocation: Location | null
  ): Location | void {
    // If robot hasn't been placed on the shape yet,
    // and command is not a place command, then simply return;
    const matchObj = PLACE_COMMAND_REGEX.exec(command);
    if (!matchObj && !robotCurrentLocation) return;

    if (command === "MOVE") {
      const newPosition = this.getFutureMovePosition(robotCurrentLocation);

      // If the new location is within the shape boundary
      if (this.shapeToRoamOn.isPointInsideShape(newPosition)) {
        return {
          direction: robotCurrentLocation.direction,
          position: newPosition,
        };
      }
    } else if (command === "LEFT" || command === "RIGHT") {
      const newDirection = this.getFutureDirection(
        robotCurrentLocation.direction,
        command
      );
      return {
        direction: newDirection,
        position: robotCurrentLocation.position,
      };
    } else if (matchObj) {
      const {
        groups: { x, y, direction },
      } = matchObj;

      const newDirection = direction as Direction;
      const newPosition = new Point(Number(x), Number(y));

      // Check if new location is within the shape boundary
      if (this.shapeToRoamOn.isPointInsideShape(newPosition)) {
        return {
          direction: newDirection,
          position: newPosition,
        };
      }
    } else if (command === "REPORT") {
      if (!robotCurrentLocation) return;
      const {
        position: { x, y },
        direction,
      } = robotCurrentLocation;
      //NOTE: can write to a different file using `fs.writeFile` module
      console.log(x, y, direction);
    } else {
      return undefined;
    }
  }
}
