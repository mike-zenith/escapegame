import { Side, inverseSide, rotateSide } from "./Side";

export class Chamber {

  private cardsMap: Map<Side, Chamber> = new Map();

  constructor(private exits: Side[], private entrance?: Side) {

  }

  public hasFreeExits(): Boolean {
    return this.exits.filter(side => this.hasFreeExit(side)).length > 0;
  }

  public hasFreeExit(side: Side): Boolean {
    return !this.cardsMap.has(side);
  }

  public hasEntrance(side: Side): Boolean {
    return this.entrance === side;
  }

  public placeOnSide(chamber: Chamber, side: Side): void {
    if (this.cardsMap.has(side)) {
      throw new CannotPlaceChamberException();
    }

    if (!this.exits.includes(side) || !chamber.hasEntrance(inverseSide(side))) {
      throw new CannotPlaceChamberException();
    }
    this.cardsMap.set(side, chamber);

    chamber.placedOnSide(this, inverseSide(side));
  }

  public placedOnSide(chamber: Chamber, side: Side): void {
    if (this.cardsMap.has(side)) {
      throw new CannotPlaceChamberException();
    }

    if (!this.hasEntrance(side) || chamber.getChamberOnSide(inverseSide(side)) !== this) {
      throw new CannotPlaceChamberException();
    }
    this.cardsMap.set(side, chamber);
  }

  public getChamberOnSide(side: Side): Chamber {
    if (!this.cardsMap.has(side)) {
      throw new Error();
    }
    return this.cardsMap.get(side)!;
  }

  public rotate(): void {
    if (this.entrance !== undefined) {
      this.entrance = rotateSide(this.entrance);
    }
    this.exits = this.exits.map(rotateSide);
  }
}

export class CannotPlaceChamberException extends Error {

}