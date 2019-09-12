import { DiceFace, Dice, CannotRollException } from "../src/Dice";
import { createFakeDiceRoller } from "./fakes/DiceRoller";

describe("Dice", () => {
  it("can be rolled to a face", () => {
    const dice = new Dice(createFakeDiceRoller(DiceFace.YELLOW));
    const face = dice.roll();
    expect(Object.values(DiceFace)).toContainEqual(face);
  });

  it("cannot be rolled when face is cursed", () => {
    const dice = new Dice(createFakeDiceRoller(DiceFace.BLACK));
    expect(() => dice.roll()).toThrowError(CannotRollException);
  });
});
