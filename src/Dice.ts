export class CannotRollException extends Error {
  constructor() {
    super();
  }
}

export enum DiceFace {
  YELLOW,
  BLACK,
  BLUE,
  GREEN,
  RED
}

export class Dice {
  private rolledFace?: DiceFace;

  public constructor(private diceRoller: DiceRoller) {
    this.roll();
  }

  public roll(): DiceFace {
    if (this.rolledFace && this.rolledFace === DiceFace.BLACK) {
      throw new CannotRollException();
    }
    this.rolledFace = this.diceRoller();
    return this.rolledFace;
  }

  public isRollable(): boolean {
    return this.rolledFace !== DiceFace.BLACK;
  }

  public isRolledFaceEqual(face: DiceFace): boolean {
    return this.rolledFace === face;
  }
}

export interface DiceRoller {
  (): DiceFace;
}
