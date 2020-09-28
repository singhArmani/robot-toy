export class Point {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    if (typeof x !== "number" || typeof y !== "number") {
      throw new Error(`Point constructor expects number args`);
    }
    this.x = x;
    this.y = y;
  }
}

export class Shape {
  private readonly length: number;
  private readonly breadth: number;

  // Table corner
  private readonly origin: Point;

  constructor(length: number, breadth: number, origin = new Point(0, 0)) {
    this.length = length;
    this.breadth = breadth;
    this.origin = origin;
  }

  getOrigin(): Point {
    return this.origin;
  }

  // NOTE: origin (0, 0) is considered to be South West
  isPointInsideShape(point: Point): boolean {
    return (
      point.x <= this.length &&
      point.x >= this.origin.x &&
      point.y <= this.breadth &&
      point.y >= this.origin.y
    );
  }
}

export class SquareTable extends Shape {
  constructor(size: number, origin?: Point) {
    super(size, size, origin);
  }
}
