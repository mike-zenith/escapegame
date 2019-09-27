export enum Side {
  NORTH,
  EAST,
  SOUTH,
  WEST
}


export function rotateSide(side: Side): Side {
  const sides = [Side.NORTH, Side.EAST, Side.SOUTH, Side.WEST];
  const actualSideIdx = sides.indexOf(side);
  if (actualSideIdx === 3) {
    return Side.NORTH;
  }
  return sides[actualSideIdx + 1];
}

export function inverseSide(side: Side): Side {
  const oppositeSides: { [k: string]: Side } = {
    [Side.SOUTH]: Side.NORTH,
    [Side.NORTH]: Side.SOUTH,
    [Side.EAST]: Side.WEST,
    [Side.WEST]: Side.EAST
  }
  return oppositeSides[side];
}