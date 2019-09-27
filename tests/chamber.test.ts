import { Side } from "../src/Side";
import { Chamber } from "../src/Chamber";

describe("Chamber", () => {

  [
    { exits: [Side.WEST], entrance: Side.NORTH, expected: Side.EAST },
    { exits: [Side.WEST], entrance: Side.EAST, expected: Side.SOUTH },
    { exits: [Side.WEST], entrance: Side.SOUTH, expected: Side.WEST },
    { exits: [Side.WEST], entrance: Side.WEST, expected: Side.NORTH },
  ].forEach(({ exits, entrance, expected }) => {
    test(`rotating chamber rotates entrance (entrance: ${entrance}, expected: ${expected})`, () => {
      const chamber = new Chamber(exits, entrance);
      chamber.rotate();
      expect(chamber.hasEntrance(expected)).toBeTruthy();
    });
  })

  test("rotating a chamber rotates exit", () => {
    const chamber = new Chamber([Side.WEST], Side.NORTH);
    chamber.rotate();
    expect(chamber.hasFreeExit(Side.NORTH)).toBeTruthy();
  });

  test("cannot place chamber without matching exits and entrance", () => {
    const currentChamber = new Chamber([Side.WEST], Side.NORTH);
    const targetChamber = new Chamber([Side.WEST], Side.SOUTH);
    expect(() => currentChamber.placeOnSide(targetChamber, Side.NORTH)).toThrowError();
  });

  test("can place chamber with matching entrance and exit", () => {
    const currentChamber = new Chamber([Side.NORTH], Side.WEST);
    const targetChamber = new Chamber([Side.EAST], Side.SOUTH);
    currentChamber.placeOnSide(targetChamber, Side.NORTH);
    expect(currentChamber.hasFreeExit(Side.NORTH)).toBeFalsy();
  });

  test("can place chamber after rotating to match entrance and exit", () => {
    const currentChamber = new Chamber([Side.NORTH], Side.WEST);
    const targetChamber = new Chamber([Side.EAST], Side.EAST);
    targetChamber.rotate();
    currentChamber.placeOnSide(targetChamber, Side.NORTH);
    expect(currentChamber.hasFreeExit(Side.NORTH)).toBeFalsy();
  });

  test("can place after rotating multiple times to match entrance and exit", () => {
    const currentChamber = new Chamber([Side.SOUTH], Side.WEST);
    const targetChamber = new Chamber([Side.EAST], Side.SOUTH);
    targetChamber.rotate();
    targetChamber.rotate();
    currentChamber.placeOnSide(targetChamber, Side.SOUTH);
    expect(currentChamber.hasFreeExit(Side.SOUTH)).toBeFalsy();
  });

  test("rotating entrance multiple times results in free entrance", () => {
    const chamber = new Chamber([Side.SOUTH], Side.WEST);
    chamber.rotate();
    chamber.rotate();
    expect(chamber.hasEntrance(Side.EAST)).toBeTruthy();
  });

  test("placing a card on an exit side places the other card to the inverse side", () => {
    const chamber = new Chamber([Side.SOUTH], Side.WEST);
    const targetChamber = new Chamber([Side.SOUTH], Side.NORTH);
    chamber.placeOnSide(targetChamber, Side.SOUTH);
    expect(targetChamber.getChamberOnSide(Side.NORTH)).toStrictEqual(chamber);
  });

});