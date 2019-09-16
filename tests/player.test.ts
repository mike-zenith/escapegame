import { DicePack } from "../src/DicePack";
import { DiceFace } from "../src/Dice";

enum Side {
  WEST,
  EAST
}

class Chamber {

}

class CannotDrawException extends Error {

}

class CannotPlaceChamberException extends Error {

}

class CannotMoveException extends Error {

}

class Player {

  private drawnCards: number = 0;

  private cardsOnSide: Side[] = [];
  public isInStartChamber(): Boolean {
    return true;
  }

  public draw(useDices: DiceFace[]): Chamber {
    this.drawnCards++;
    if (this.drawnCards > 2) {
      throw new CannotDrawException();
    }
    return new Chamber();
  }

  place(chamber: Chamber, side: Side): void {
    if (this.cardsOnSide.includes(side)) {
      throw new CannotPlaceChamberException();
    }
    this.cardsOnSide.push(side);
  }

  goToChamber(side: Side, useDices: DiceFace[]): void {
    throw new CannotMoveException();
  }
}

describe("Player", () => {

  const drawCardRequirements = [DiceFace.GREEN, DiceFace.GREEN];
  let player: Player;

  beforeEach(() => {
    player = new Player();
  });

  const drawCardAndPlaceToSide = (side: Side) => {
    const chamber = player.draw(drawCardRequirements);
    player.place(chamber, side);
  }

  it("starts the game from the start chamber", () => {
    expect(player.isInStartChamber()).toStrictEqual(true);
  });

  it("can use 2 green dices to draw a chamber card", () => {
    const chamber = player.draw(drawCardRequirements);
    expect(chamber).toBeInstanceOf(Chamber);
  });

  it("cannot draw cards when the current chamber has no more exits", () => {
    drawCardAndPlaceToSide(Side.WEST);
    drawCardAndPlaceToSide(Side.EAST);
    expect(() => player.draw(drawCardRequirements)).toThrowError(CannotDrawException);
  });

  it("can only place one card to a side", () => {
    drawCardAndPlaceToSide(Side.EAST);
    const chamberThatShouldNotBePlaced = player.draw(drawCardRequirements);
    expect(() => player.place(chamberThatShouldNotBePlaced, Side.EAST)).toThrowError(CannotPlaceChamberException)
  });

  it("cannot go to a chamber that is not placed", () => {
    expect(() => player.goToChamber(Side.EAST, [DiceFace.GREEN, DiceFace.GREEN])).toThrowError(CannotMoveException);
  });

  it("moving to an already placed chamber, then moving back to start is possible", () => {
    drawCardAndPlaceToSide(Side.EAST);
    player.goToChamber(Side.EAST, [DiceFace.GREEN, DiceFace.GREEN]);
    player.goToChamber(Side.WEST, [DiceFace.GREEN, DiceFace.GREEN]);
    expect(player.isInStartChamber()).toStrictEqual(true);
  });




});