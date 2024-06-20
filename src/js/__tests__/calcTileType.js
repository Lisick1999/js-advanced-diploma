import { calcTileType } from '../utils';

test('return top', () => {
  const stringBorder = calcTileType(1, 8);
  expect(stringBorder).toBe('top');
});

test('return top-left', () => {
  const stringBorder = calcTileType(0, 8);
  expect(stringBorder).toBe('top-left');
});

test('return top-right', () => {
  const stringBorder = calcTileType(7, 8);
  expect(stringBorder).toBe('top-right');
});

test('return right', () => {
  const stringBorder = calcTileType(15, 8);
  expect(stringBorder).toBe('right');
});

test('return left', () => {
  const stringBorder = calcTileType(16, 8);
  expect(stringBorder).toBe('left');
});

test('return bottom', () => {
  const stringBorder = calcTileType(60, 8);
  expect(stringBorder).toBe('bottom');
});

test('return bottom-right', () => {
  const stringBorder = calcTileType(63, 8);
  expect(stringBorder).toBe('bottom-right');
});

test('return bottom-left', () => {
  const stringBorder = calcTileType(56, 8);
  expect(stringBorder).toBe('bottom-left');
});

test('return center', () => {
  const stringBorder = calcTileType(44, 8);
  expect(stringBorder).toBe('center');
});
