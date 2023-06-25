import { test, assert } from "vitest";

import Deventor from "../src";

test('Deventor creation', () => {
  const newDeventor = new Deventor();

  assert.instanceOf(newDeventor, Deventor);
});

test('Get max listeners', () => {
  const newDeventor = new Deventor({ maxListeners: 12 });

  assert.equal(newDeventor.getMaxListeners(), 12);
});
