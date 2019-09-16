import { Dice, DiceFace, CannotRollException } from "../src/Dice";
import { DicePack } from "../src/DicePack";
import { createFakeDiceRoller } from "./fakes/DiceRoller";

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

  it("can roll when selecting yellow dice with cursed dice", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];

    const expectedOutput = [DiceFace.BLACK, DiceFace.YELLOW, DiceFace.RED];

    const dicePack = new DicePack(dices);
    expect(dicePack.roll([DiceFace.BLACK, DiceFace.YELLOW, DiceFace.RED])).toStrictEqual(
      expectedOutput
    );
  });

  it("cannot roll when selecting yellow dice with 3 cursed dice", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];

    const dicePack = new DicePack(dices);
    const rollWithSelectedDicesThrowsException = () => {
      dicePack.roll([
        DiceFace.BLACK,
        DiceFace.BLACK,
        DiceFace.BLACK,
        DiceFace.YELLOW,
        DiceFace.RED
      ]);
    };
    expect(rollWithSelectedDicesThrowsException).toThrowError(CannotRollException);
  });

  it("rolls with rollable dices when having yellow with 2 cursed dices", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.GREEN)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];

    const expectedDiceFaces = [DiceFace.GREEN, DiceFace.BLACK, DiceFace.BLACK, DiceFace.RED, DiceFace.YELLOW];

    const dicePack = new DicePack(dices);
    expect(dicePack.roll()).toStrictEqual(expectedDiceFaces);
  });

  it("rolls with rollable dices when having yellow with 3 cursed dices", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];

    const expectedDiceFaces = [DiceFace.RED, DiceFace.YELLOW, DiceFace.BLACK, DiceFace.BLACK];

    const dicePack = new DicePack(dices);
    expect(dicePack.roll()).toStrictEqual(expectedDiceFaces);
  });

  it("rolls with uncursed black dice with one yellow", () => {
    const dices = [
      new Dice(createFakeDiceRoller(DiceFace.BLACK)),
      new Dice(createFakeDiceRoller(DiceFace.GREEN)),
      new Dice(createFakeDiceRoller(DiceFace.GREEN)),
      new Dice(createFakeDiceRoller(DiceFace.RED)),
      new Dice(createFakeDiceRoller(DiceFace.YELLOW))
    ];

    const expectedDiceFaces = [DiceFace.BLACK, DiceFace.GREEN, DiceFace.GREEN, DiceFace.RED, DiceFace.YELLOW];
    const dicePack = new DicePack(dices);
    expect(dicePack.roll()).toStrictEqual(expectedDiceFaces);
  });
});
