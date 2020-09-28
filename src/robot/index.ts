import fs from "fs";
import path from "path";
import { EOL } from "os";

import { Location } from "../brain/types";
import { Brain } from "../brain";

export class Robot {
  private location: Location;
  private readonly brain: Brain;
  constructor(brain: Brain) {
    if (!(brain instanceof Brain)) {
      throw new TypeError("I need a valid brain to work with.");
    }
    this.brain = brain;
  }

  // Place the robot to a provided location
  private place(location: Location): Robot {
    this.location = location;
    return this;
  }

  getLocation(): Location | undefined {
    return this.location;
  }

  // Report the Robot's location
  report(): void {
    if (!this.location) return;
    const {
      position: { x, y },
      direction,
    } = this.location;
    console.log(x, y, direction);
  }

  // Run single command
  run(command?: unknown): void {
    // If not a valid command, return early
    if (!this.brain.isCommandKnown(command)) return;

    const newLocation = this.brain.executeCommand(
      command as string,
      this.location
    );

    // If there's a valid location, place the robot in that location
    if (newLocation) {
      this.place(newLocation);
    }
  }

  // Run commands from a txt file containing multiple commands
  runCommandsFromFile(fileName: string): void {
    try {
      const data = fs.readFileSync(path.join(__dirname, fileName), "utf8");
      const commands = data.split(EOL);

      commands.forEach((command) => this.run(command));
    } catch {
      console.error(
        "Error reading commands from file. Please check file path again."
      );
    }
  }
}
