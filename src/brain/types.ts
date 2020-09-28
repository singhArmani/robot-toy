import type { Point } from "../shape";
import { directions, rotations } from "../brain";

export type Direction = typeof directions[keyof typeof directions];
export type Rotation = typeof rotations[keyof typeof rotations];

export type Location = {
  position: Point;
  direction: Direction;
};
