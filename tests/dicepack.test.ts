import { Dice, DiceFace, CannotRollException } from "../src/Dice";
import { createFakeDiceRoller } from "./fakes/DiceRoller";

class DicePack {
  constructor(private dices: Dice[]) { }

  public roll(selectedDices?: DiceFace[]): DiceFace[] {
    if (selectedDices && selectedDices.length) {
      return selectedDices.map(diceFace => {
        const foundDice = this.dices.find(dice =>
          dice.isRolledFaceEqual(diceFace)
        );
        if (!foundDice) {
          throw new CannotRollException();
        }
        return foundDice.roll();
      });
    }
    return this.dices
      .filter(dice => dice.isRollable())
      .map(dice => dice.roll());
  }
}

describe("Dice pack", () => {
  it("rolls all rollable dices, resulting in rollfaces", () => {
    const diceRoller = createFakeDiceRoller(DiceFace.BLUE);
    const dices = [new Dice(diceRoller), new Dice(diceRoller)];
    const expectedOutput = [DiceFace.BLUE, DiceFace.BLUE];

    const dicePack = new DicePack(dices);

    expect(dicePack.roll()).toStrictEqual(expectedOutput);
  });

  it("does not roll cursed dices", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLUE)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK))
    ];
    const expectedOutput = [DiceFace.BLUE];

    const dicePack = new DicePack(dices);
    expect(dicePack.roll()).toStrictEqual(expectedOutput);
  });

  it("rolls selected dices", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLUE)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];
    const expectedOutput = [DiceFace.YELLOW, DiceFace.RED];

    const dicePack = new DicePack(dices);
    expect(dicePack.roll([DiceFace.YELLOW, DiceFace.RED])).toStrictEqual(
      expectedOutput
    );
  });

  it("cannot roll selected but not found dices with face", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLUE)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];

    const dicePack = new DicePack(dices);
    expect(() => dicePack.roll([DiceFace.GREEN, DiceFace.RED])).toThrowError(
      CannotRollException
    );
  });

  it("cannot roll selected dice with cursed face", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.RED))
    ];

    const dicePack = new DicePack(dices);
    expect(() => dicePack.roll([DiceFace.BLACK])).toThrowError(
      CannotRollException
    );
  });

  it("can roll selected cursed face when selecting yellow", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];

    const expectedOutput = [DiceFace.BLACK, DiceFace.YELLOW];

    const dicePack = new DicePack(dices);
    expect(dicePack.roll([DiceFace.BLACK, DiceFace.YELLOW])).toStrictEqual(
      expectedOutput
    );
  });
});
