import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMoney, compareMoney, toMinorUnits, addMoney } from '../src/money.ts';
import { transactions } from '../src/data/transactions.ts';

test('currency codes distinguish dollar markets', () => {
  for (const code of ['USD', 'HKD', 'GBP', 'EUR', 'AED', 'SAR']) {
    assert.ok(formatMoney(12.4, code, 'en-GB').includes(code));
  }
});
test('zero, negative amounts and currency-specific decimal places', () => {
  assert.match(formatMoney(0, 'USD', 'en-GB'), /0\.00/);
  assert.match(formatMoney(-12.4, 'USD', 'en-GB'), /-.*12\.40/);
  assert.match(formatMoney(1200, 'JPY', 'en-GB'), /1,200$/);
  assert.match(formatMoney(12.345, 'KWD', 'en-GB'), /12\.345$/);
  assert.equal(formatMoney(-0, 'USD', 'en-GB'), formatMoney(0, 'USD', 'en-GB'));
});
test('bad input cannot crash rendering or look like a valid zero', () => {
  for (const value of [NaN, Infinity, -Infinity, Number.MAX_VALUE]) assert.equal(formatMoney(value, 'GBP', 'en-GB'), null);
  for (const code of ['', '$', 'usd', 'GB']) assert.equal(formatMoney(10, code, 'en-GB'), null);
  assert.equal(formatMoney(10, 'GBP', 'bad_locale'), null);
});
test('Arabic amounts still identify the currency', () => {
  assert.ok(formatMoney(12.4, 'AED', 'ar-u-nu-latn').includes('AED'));
});
test('sort groups currencies before comparing values; equality is stable', () => {
  const rows = [{ currency: 'USD', amount: 1 }, { currency: 'GBP', amount: 20 }, { currency: 'GBP', amount: 5 }];
  assert.deepEqual([...rows].sort(compareMoney), [rows[2], rows[1], rows[0]]);
  assert.equal(compareMoney(rows[0], rows[0]), 0);
});

test('decimal ties round away from zero before integer-unit addition', () => {
  assert.equal(toMinorUnits(1.005, 'GBP'), 101);
  assert.equal(toMinorUnits(-1.005, 'GBP'), -101);
  assert.equal(toMinorUnits(2.675, 'GBP'), 268);
  assert.equal(toMinorUnits(1e-7, 'GBP'), 0);
  assert.equal(toMinorUnits(12.3455, 'KWD'), 12346);
  assert.equal(addMoney('GBP', 0.1, 0.2), 0.3);
  assert.equal(addMoney('GBP', 1.005, 0.005), 1.02);
  assert.equal(toMinorUnits(NaN, 'GBP'), null);
  assert.ok(Number.isNaN(addMoney('GBP', Infinity, 1)));
  assert.equal(addMoney('JPY', Number.MAX_SAFE_INTEGER, 2, -Number.MAX_SAFE_INTEGER), 2);
  assert.ok(Number.isNaN(addMoney('JPY', Number.MAX_SAFE_INTEGER, 1)));
});

test('every fixture has canonical currency precision and refunds reconcile', () => {
  const kinds = new Set();
  for (const tx of transactions) {
    assert.equal(toMinorUnits(tx.amount, tx.currency) / 100, tx.amount);
    assert.equal(toMinorUnits(tx.fee, tx.currency) / 100, tx.fee);
    if (!tx.refund) { assert.notEqual(tx.status, 'refunded'); continue; }
    assert.equal(tx.status, 'refunded');
    const refund = tx.refund;
    kinds.add(refund.kind);
    assert.ok(refund.amount > 0 && refund.amount <= tx.amount);
    assert.equal(refund.feeReturned, 0);
    const original = addMoney(tx.currency, tx.amount, tx.fee);
    const credit = addMoney(tx.currency, refund.amount, refund.feeReturned);
    const net = addMoney(tx.currency, original, -credit);
    assert.equal(addMoney(tx.currency, credit, net), original);
    if (refund.kind === 'full') assert.equal(net, tx.fee);
    else assert.ok(net > tx.fee);
  }
  assert.deepEqual([...kinds].sort(), ['full', 'partial']);
});
