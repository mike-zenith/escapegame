import { DiceFace, DiceRoller } from "../../src/Dice";

export const createFakeDiceRoller = (faceToRoll: DiceFace): DiceRoller => {
  return (): DiceFace => {
    return faceToRoll;
  };
};
