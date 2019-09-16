import { Dice, DiceFace, CannotRollException } from './Dice';

function filterDicesWithFace(filterableDices: Dice[], face: DiceFace): Dice[] {
  return filterableDices.filter(dice => dice.isRolledFaceEqual(face));
}

export class DicePack {
  constructor(private dices: Dice[]) { }

  private hasDiceFace(diceFace: DiceFace): Boolean {
    return this.dices.findIndex(dice => dice.isRolledFaceEqual(diceFace)) !== -1;
  }

  public roll(withSelectedDiceFaces?: DiceFace[]): DiceFace[] {
    let rollWithDices: Dice[] = this.dices;

    if (withSelectedDiceFaces) {
      if (withSelectedDiceFaces.find(diceFace => !this.hasDiceFace(diceFace))) {
        throw new CannotRollException();
      }

      rollWithDices = withSelectedDiceFaces.map(diceFace => this.dices.find(dice => dice.isRolledFaceEqual(diceFace))!);
    }

    const yellowFacedDices = filterDicesWithFace(rollWithDices, DiceFace.YELLOW);
    const cursedFacedDices = filterDicesWithFace(rollWithDices, DiceFace.BLACK);
    const hasTwiceTheCursedDicesAsYellow = cursedFacedDices.length - yellowFacedDices.length * 2 > 0;
    if (hasTwiceTheCursedDicesAsYellow) {
      if (withSelectedDiceFaces) {
        throw new CannotRollException();
      }

      rollWithDices = rollWithDices.filter(dice => dice.isRollable());
      const addOneExistingCursedDiceToRollable = () => {
        if (cursedFacedDices.length) {
          rollWithDices.push(cursedFacedDices.shift()!);
        }
      }
      const addTwoExistingCursedDicesToRollable = () => {
        addOneExistingCursedDiceToRollable();
        addOneExistingCursedDiceToRollable();
      }
      yellowFacedDices.forEach(addTwoExistingCursedDicesToRollable);
    }

    return rollWithDices.map(dice => dice.roll());
  }
}
