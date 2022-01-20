import { Greeter } from '../index1';
test('My Greeter', () => {
  expect(Greeter('Carl')).toBe('Hello Carl');
});