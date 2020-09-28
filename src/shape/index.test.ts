import { Point, Shape, SquareTable } from "./";

describe("Point", () => {
  it("should create a Point instance", () => {
    const point = new Point(4, 5);
    expect(point).toBeInstanceOf(Point);
    expect(point.x).toEqual(4);
    expect(point.y).toEqual(5);
  });
});

describe("Shape", () => {
  describe("origin: default (0, 0)", () => {
    const table = new Shape(5, 6);
    it("should create a Shape instance", () => {
      expect(table).toBeInstanceOf(Shape);

      expect(table.getOrigin()).toMatchObject({ x: 0, y: 0 });
    });

    it("should return true when point is inside the boundary", () => {
      const point = new Point(5, 5);
      expect(table.isPointInsideShape(point)).toEqual(true);
    });

    it("should return false when point is outside the boundary", () => {
      const point = new Point(5, 7);
      expect(table.isPointInsideShape(point)).toEqual(false);
    });

    it("should return true when point is over the boundary", () => {
      const point = new Point(5, 6);
      expect(table.isPointInsideShape(point)).toEqual(true);
    });
  });

  describe("origin: custom", () => {
    const table = new Shape(5, 6, new Point(1, 2));
    it("should return true when point is inside the boundary", () => {
      const point = new Point(5, 5);
      expect(table.isPointInsideShape(point)).toEqual(true);
      expect(table.getOrigin()).toMatchObject({ x: 1, y: 2 });
    });

    it("should return false when point is outside the boundary", () => {
      const point = new Point(0, 0);
      expect(table.isPointInsideShape(point)).toEqual(false);
    });

    it("should return true when point is over the boundary", () => {
      const point = new Point(1, 2);
      expect(table.isPointInsideShape(point)).toEqual(true);
    });
  });

  describe("SquareTable", () => {
    const squareTable = new SquareTable(10);
    it("should create an instance of SquareTable", () => {
      expect(squareTable).toBeInstanceOf(Shape);
      expect(squareTable.getOrigin()).toMatchObject({ x: 0, y: 0 });
    });
  });
});
