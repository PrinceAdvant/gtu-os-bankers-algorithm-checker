const F = require('./calc.js');
const eq = (x, y, msg) => {
  if (JSON.stringify(x) !== JSON.stringify(y)) throw Error((msg ? msg + ': ' : '') + JSON.stringify(x) + ' vs ' + JSON.stringify(y));
};
const A = [[1,0,1],[2,1,1],[0,1,0],[1,1,2],[0,0,1]];
const M = [[3,2,2],[3,2,2],[2,2,1],[2,2,3],[1,1,3]];
const avail = [1,1,1];
const r = F.bankers(A, M, avail);
eq(r.need, [[2,2,1],[1,1,1],[2,1,1],[1,1,1],[1,1,2]], 'need');
eq(r.safe, true, 'safe');
eq(r.seq, [1,2,3,4,0], 'seq');
eq(r.finalWork, [5,4,6], 'final work');
eq(r.total, [5,4,6], 'total instances');

// unsafe: P0 already holds more than is globally available to finish others
const u = F.bankers([[3,0,0],[0,2,0],[0,0,2]], [[4,0,0],[0,3,0],[0,0,3]], [0,0,0]);
eq(u.safe, false, 'unsafe');
eq(u.seq, [], 'no finish');

// request-style: after granting nothing, a 2-process 1-resource safe case
const s2 = F.bankers([[1],[1]], [[2],[2]], [1]);
eq(s2.safe, true);
eq(s2.seq, [0,1]);
eq(s2.need, [[1],[1]]);

const throws = (fn) => { try { fn(); } catch (e) { return; } throw Error('expected an error'); };
throws(() => F.bankers([[2]], [[1]], [0]));
throws(() => F.parseMatrix('a b', 'Alloc'));

console.log('All checks passed');
