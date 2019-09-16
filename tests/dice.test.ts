import { DiceFace, Dice, CannotRollException } from "../src/Dice";
import { createFakeDiceRoller } from "./fakes/DiceRoller";

describe("Dice", () => {
  it("can be rolled to a face", () => {
    const dice = new Dice(createFakeDiceRoller(DiceFace.YELLOW));
    const face = dice.roll();
    expect(Object.values(DiceFace)).toContainEqual(face);
  });
});
