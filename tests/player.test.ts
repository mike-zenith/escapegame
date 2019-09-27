import { DiceFace } from "../src/Dice";
import { Side } from "../src/Side";
import { Chamber, CannotPlaceChamberException } from "../src/Chamber";

class CannotDrawException extends Error { }

class CannotMoveException extends Error { }

class DeckIsEmptyException extends Error { }

class Player {
  private currentCard: Chamber;

  constructor(
    private readonly deck: Chamber[],
    private readonly startingChamber: Chamber
  ) {
    this.currentCard = startingChamber;
  }

  public isInStartChamber(): boolean {
    return this.currentCard === this.startingChamber;
  }

  public draw(useDices: DiceFace[]): Chamber {
    if (!this.currentCard.hasFreeExits()) {
      throw new CannotDrawException();
    }
    if (!this.deck.length) {
      throw new DeckIsEmptyException();
    }
    return this.deck.pop()!;
  }

  place(chamber: Chamber, side: Side): void {
    this.currentCard.placeOnSide(chamber, side);
  }

  goToChamber(side: Side, useDices: DiceFace[]): void {
    if (this.currentCard.hasFreeExit(side)) {
      throw new CannotMoveException();
    }
    this.currentCard = this.currentCard.getChamberOnSide(side);
  }
}

describe.only("Player", () => {
  const drawCardRequirements = [DiceFace.GREEN, DiceFace.GREEN];
  let player: Player;
  let deck: Chamber[];

  beforeEach(() => {
    deck = [];
    player = new Player(deck, new Chamber([Side.WEST, Side.EAST]));
  });

  const drawCardAndPlaceToSideAfterRotating = (
    side: Side,
    rotateCount = 0,
    cardToDraw: Chamber = new Chamber([Side.WEST], Side.EAST)
  ): void => {
    deck.push(cardToDraw);
    const chamber = player.draw(drawCardRequirements);
    while (rotateCount--) {
      chamber.rotate();
    }
    player.place(chamber, side);
  };

  it("starts the game from the start chamber", () => {
    expect(player.isInStartChamber()).toStrictEqual(true);
  });

  it("can use 2 green dices to draw a chamber card", () => {
    deck.push(new Chamber([Side.WEST], Side.EAST));
    const chamber = player.draw(drawCardRequirements);
    expect(chamber).toBeInstanceOf(Chamber);
  });

  it("cannot draw cards when the current chamber has no more exits", () => {
    drawCardAndPlaceToSideAfterRotating(Side.WEST);
    drawCardAndPlaceToSideAfterRotating(Side.EAST, 2);
    expect(() => player.draw(drawCardRequirements)).toThrowError(
      CannotDrawException
    );
  });

  it("can only place one card to a side", () => {
    drawCardAndPlaceToSideAfterRotating(Side.WEST);
    deck.push(new Chamber([Side.NORTH], Side.EAST));
    const chamberThatShouldNotBePlaced = player.draw(drawCardRequirements);
    expect(() =>
      player.place(chamberThatShouldNotBePlaced, Side.WEST)
    ).toThrowError(CannotPlaceChamberException);;
  });

  it("cannot go to a chamber that is not placed", () => {
    expect(() =>
      player.goToChamber(Side.EAST, [DiceFace.GREEN, DiceFace.GREEN])
    ).toThrowError(CannotMoveException);
  });

  it("moving to an already placed chamber, then moving back to start is possible", () => {
    drawCardAndPlaceToSideAfterRotating(
      Side.EAST,
      0,
      new Chamber([Side.NORTH], Side.WEST)
    );
    player.goToChamber(Side.EAST, [DiceFace.GREEN, DiceFace.GREEN]);
    player.goToChamber(Side.WEST, [DiceFace.GREEN, DiceFace.GREEN]);
    expect(player.isInStartChamber()).toStrictEqual(true);
  });

  it("drawing, placing and going into a chamber with north exit and west entrance should not let us place more than 1 card", () => {
    drawCardAndPlaceToSideAfterRotating(
      Side.EAST,
      0,
      new Chamber([Side.NORTH], Side.WEST)
    );
    player.goToChamber(Side.EAST, [DiceFace.GREEN, DiceFace.GREEN]);
    drawCardAndPlaceToSideAfterRotating(
      Side.NORTH,
      0,
      new Chamber([Side.NORTH], Side.SOUTH)
    );
    expect(() => player.draw(drawCardRequirements)).toThrowError(
      CannotDrawException
    );
  });

  it("moving to another chamber from start will not be the start chamber", () => {
    drawCardAndPlaceToSideAfterRotating(Side.WEST);
    player.goToChamber(Side.WEST, [DiceFace.GREEN, DiceFace.GREEN]);
    expect(player.isInStartChamber()).toStrictEqual(false);
  });

  it("cannot draw cards when there are not any in deck", () => {
    deck = [];
    expect(() => player.draw(drawCardRequirements)).toThrowError(
      DeckIsEmptyException
    );
  });

  it("standing on a chamber with an exit on south should not let us place a card on east", () => {
    drawCardAndPlaceToSideAfterRotating(
      Side.EAST,
      0,
      new Chamber([Side.SOUTH], Side.WEST)
    );
    player.goToChamber(Side.EAST, [DiceFace.GREEN, DiceFace.GREEN]);
    drawCardAndPlaceToSideAfterRotating(
      Side.SOUTH,
      0,
      new Chamber([Side.SOUTH], Side.NORTH)
    );
    player.goToChamber(Side.SOUTH, [DiceFace.GREEN, DiceFace.GREEN]);

    expect(() => drawCardAndPlaceToSideAfterRotating(Side.EAST)).toThrowError(
      CannotPlaceChamberException
    );
  });

  it("cannot place a card with south exit and north entrance next to the starting card", () => {
    deck.push(new Chamber([Side.SOUTH], Side.NORTH));
    const chamber = player.draw(drawCardRequirements);
    expect(() => player.place(chamber, Side.WEST)).toThrowError(
      CannotPlaceChamberException
    );
  });

  it.todo(
    "placing a card with entrance on north and exit on south next to the starting chamber requires rotating it to CW"
  );
});
