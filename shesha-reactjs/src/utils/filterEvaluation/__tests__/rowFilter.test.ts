import { resolveFilterSync } from '../engine';
import { filterRows, matchesJsonLogic, matchesRow } from '../rowFilter';
import { containsRowScopedNode, isRowScopedExpression, splitRowScoped } from '../rowScope';

const rowExpr = (expression: string, required = true): object => ({ evaluate: [{ expression, type: 'mustache', required }] });
const upperCountryIsZa = { '==': [rowExpr('{{UPPER(row.country)}}'), 'ZA'] };
const populationOverMillion = { '>': [{ var: 'population' }, 1000000] };
const context = { data: { minArea: 100 } };

describe('row scope detection', () => {
  it('recognises row as a root and nothing else', () => {
    expect(isRowScopedExpression('{{UPPER(row.country)}}')).toBe(true);
    expect(isRowScopedExpression('return row.population > 5;')).toBe(true);
    expect(isRowScopedExpression('{{data.row}}')).toBe(false);
    expect(isRowScopedExpression('{{rowCount}}')).toBe(false);
    expect(isRowScopedExpression("{{CONCAT('row', data.name)}}")).toBe(false);
  });

  it('finds row-scoped nodes anywhere in a tree, including bare templates', () => {
    expect(containsRowScopedNode(upperCountryIsZa)).toBe(true);
    expect(containsRowScopedNode({ in: ['{{row.country}}', { var: 'names' }] })).toBe(true);
    expect(containsRowScopedNode(populationOverMillion)).toBe(false);
  });
});

describe('splitting a filter between server and browser', () => {
  it('moves only the row-scoped children of a root and', () => {
    const { server, row } = splitRowScoped({ and: [populationOverMillion, upperCountryIsZa] });
    expect(server).toEqual(populationOverMillion);
    expect(row).toEqual(upperCountryIsZa);
  });

  it('keeps several children of each side together under and', () => {
    const areaRule = { '>=': [{ var: 'area' }, '{{data.minArea}}'] };
    const other = { in: ['a', rowExpr('{{row.country}}')] };
    const { server, row } = splitRowScoped({ and: [populationOverMillion, upperCountryIsZa, areaRule, other] });
    expect(server).toEqual({ and: [populationOverMillion, areaRule] });
    expect(row).toEqual({ and: [upperCountryIsZa, other] });
  });

  it('sends an or with a row-scoped child entirely to the browser', () => {
    const logic = { or: [populationOverMillion, upperCountryIsZa] };
    expect(splitRowScoped(logic)).toEqual({ server: undefined, row: logic });
  });

  it('leaves a filter without row references alone', () => {
    expect(splitRowScoped(populationOverMillion)).toEqual({ server: populationOverMillion, row: undefined });
  });

  it('is applied by the engine: the request carries the server part, the result carries the row part', () => {
    const result = resolveFilterSync({ and: [populationOverMillion, upperCountryIsZa] }, { context });
    expect(result.status).toBe('ready');
    expect(result.logic).toEqual(populationOverMillion);
    expect(result.rowFilter).toEqual(upperCountryIsZa);
    expect(result.hasExpressions).toBe(true);
  });

  it('reports ready with no request filter when everything is row-scoped', () => {
    const result = resolveFilterSync(upperCountryIsZa, { context });
    expect(result.logic).toBeUndefined();
    expect(result.status).toBe('ready');
    expect(result.rowFilter).toEqual(upperCountryIsZa);
  });
});

describe('matching fetched rows', () => {
  it('evaluates a function over the row', () => {
    expect(matchesRow({ country: 'za' }, upperCountryIsZa, { context })).toBe(true);
    expect(matchesRow({ country: 'uk' }, upperCountryIsZa, { context })).toBe(false);
  });

  it('supports contains, starts with, comparisons and dates', () => {
    const concat = { in: ['th af', rowExpr("{{CONCAT(row.country, ' ', row.region)}}")] };
    expect(matchesRow({ country: 'South Africa', region: 'Africa' }, concat, { context })).toBe(true);
    expect(matchesRow({ country: 'Spain', region: 'Europe' }, concat, { context })).toBe(false);

    const starts = { startsWith: [rowExpr('{{row.country}}'), 'sou'] };
    expect(matchesRow({ country: 'South Africa' }, starts, { context })).toBe(true);

    const floor = { '>=': [rowExpr('{{FLOOR(row.population / 1000)}}'), 59] };
    expect(matchesRow({ population: 59500 }, floor, { context })).toBe(true);
    expect(matchesRow({ population: 58999 }, floor, { context })).toBe(false);

    const since = { '>=': [rowExpr('{{row.creationTime}}'), '2026-01-01'] };
    expect(matchesRow({ creationTime: '2026-09-10T06:00:00' }, since, { context })).toBe(true);
    expect(matchesRow({ creationTime: '2025-12-31T23:59:59' }, since, { context })).toBe(false);
  });

  it('reads row columns through var as well, and mixes in the form context', () => {
    const logic = { and: [{ '==': [{ var: 'country' }, rowExpr('{{row.country}}')] }, { '>': [rowExpr('{{row.area}}'), '{{data.minArea}}'] }] };
    expect(matchesRow({ country: 'za', area: 150 }, logic, { context })).toBe(true);
    expect(matchesRow({ country: 'za', area: 50 }, logic, { context })).toBe(false);
  });

  it('drops an optional rule whose expression is empty, and fails the row for a required one', () => {
    const optional = { '==': [rowExpr('{{row.missing}}', false), 'x'] };
    expect(matchesRow({ country: 'za' }, optional, { context })).toBe(true);
    const required = { '==': [rowExpr('{{row.missing}}'), 'x'] };
    expect(matchesRow({ country: 'za' }, required, { context })).toBe(false);
  });

  it('keeps rows when the row part uses an operator the browser cannot run', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const logic = { is_satisfied: [{ var: 'spec' }, 'return row.x;'] };
    expect(matchesRow({ x: 1, country: 'za' }, { and: [logic, upperCountryIsZa] }, { context })).toBe(true);
    expect(matchesRow({ x: 1, country: 'uk' }, { and: [logic, upperCountryIsZa] }, { context })).toBe(false);
    spy.mockRestore();
  });

  it('evaluates resolved logic against a local record, as an in-memory source would', () => {
    const people = [
      { id: '1', name: 'Claude', surname: 'Amodei', hasAccess: false, joined: '2026-02-01' },
      { id: '2', name: 'Dario', surname: 'Amodei', hasAccess: true, joined: '2021-01-15' },
      { id: '3', name: 'Ada', surname: 'Lovelace', hasAccess: true, joined: '1843-12-01' },
    ];
    const logic = { and: [{ '==': [{ var: 'hasAccess' }, true] }, { in: ['amo', { var: 'surname' }] }, { '>=': [{ var: 'joined' }, '2000-01-01'] }] };
    expect(people.filter((p) => matchesJsonLogic(p, logic) === true).map((p) => p.id)).toEqual(['2']);
    expect(matchesJsonLogic(people[0]!, undefined)).toBe(true);
    expect(matchesJsonLogic(people[0]!, {})).toBe(true);
    expect(matchesJsonLogic(people[0]!, { is_satisfied: [{ var: 'spec' }] })).toBeUndefined();
    expect(matchesJsonLogic({ id: 'x', address: { city: 'Cape Town' } }, { startsWith: [{ var: 'address.city' }, 'cape'] })).toBe(true);
  });

  it('filters a page', () => {
    const rows = [{ id: '1', country: 'za' }, { id: '2', country: 'uk' }, { id: '3', country: 'Za' }];
    expect(filterRows(rows, upperCountryIsZa, { context }).map((r) => r.id)).toEqual(['1', '3']);
    expect(filterRows(rows, undefined, { context })).toBe(rows);
  });
});
