(function (root) {
  const F = {};

  function parseMatrix(text, name) {
    const rows = String(text).trim().split(/\n+/).map(line => line.trim().split(/[\s,]+/).filter(Boolean).map(Number));
    if (!rows.length || rows.some(r => !r.length || r.some(x => !Number.isFinite(x)))) throw new Error(name + ' must be a numeric matrix (space or comma separated)');
    const w = rows[0].length;
    if (rows.some(r => r.length !== w)) throw new Error(name + ': every row must have the same number of columns');
    return rows;
  }
  function parseVec(text, name) {
    const v = String(text).trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (!v.length || v.some(x => !Number.isFinite(x))) throw new Error(name + ' must be a numeric list');
    return v;
  }
  function vec(v) { return '(' + v.join(', ') + ')'; }
  F.parseMatrix = parseMatrix;
  F.parseVec = parseVec;
  F.bankers = function (alloc, mx, avail) {
    const n = alloc.length, m = avail.length;
    if (!n) throw new Error('Need at least one process');
    if (mx.length !== n) throw new Error('Max must have one row per process');
    if (alloc.some(r => r.length !== m) || mx.some(r => r.length !== m)) throw new Error('Allocation, Max and Available must use the same number of resource types');
    if (avail.some(x => x < 0) || alloc.some(r => r.some(x => x < 0)) || mx.some(r => r.some(x => x < 0))) throw new Error('Values cannot be negative');
    const need = alloc.map((row, i) => row.map((a, j) => {
      const v = mx[i][j] - a;
      if (v < 0) throw new Error('Max cannot be smaller than Allocation for P' + i);
      return v;
    }));
    const work = avail.slice();
    const fin = Array(n).fill(false);
    const seq = [];
    const steps = [];
    while (true) {
      let progress = false;
      for (let i = 0; i < n; i++) {
        if (fin[i]) continue;
        const ok = need[i].every((x, j) => x <= work[j]);
        if (!ok) {
          steps.push({proc: i, ok: false, need: need[i].slice(), work: work.slice()});
          continue;
        }
        for (let j = 0; j < m; j++) work[j] += alloc[i][j];
        fin[i] = true;
        seq.push(i);
        steps.push({proc: i, ok: true, need: need[i].slice(), work: work.slice()});
        progress = true;
      }
      if (!progress) break;
    }
    const safe = fin.every(Boolean);
    const total = avail.map((a, j) => a + alloc.reduce((s, row) => s + row[j], 0));
    return {need, seq, steps, safe, finalWork: work.slice(), total, stuck: fin.map((f, i) => f ? null : i).filter(x => x !== null)};
  };
  F.format = function (r, alloc, mx, avail) {
    const fmtM = (M) => M.map((row, i) => 'P' + i + '  ' + row.join(' ')).join('\n');
    let out = 'Need = Max - Allocation:\n' + fmtM(r.need) + '\n\nWork starts as Available = ' + vec(avail) + '\n';
    let seen = {};
    for (const s of r.steps) {
      const key = s.proc + (s.ok ? ':yes' : ':no') + ':' + s.work.join(',');
      // show the comparison once per scan attempt is fine; keep all in one pass readable
      out += 'P' + s.proc + ' Need ' + vec(s.need) + ' <= Work? ' + (s.ok ? 'Yes -> Work = ' + vec(s.work) : 'No') + '\n';
    }
    if (r.safe) out += '\nSafe state. One safe sequence: <' + r.seq.map(i => 'P' + i).join(', ') + '>\n';
    else out += '\nUnsafe state. Finished: ' + (r.seq.length ? r.seq.map(i => 'P' + i).join(', ') : 'none') + '. Stuck: ' + r.stuck.map(i => 'P' + i).join(', ') + '.\n';
    out += 'Final Work = ' + vec(r.finalWork) + '\nSelf-check (Available + column sums of Allocation) = ' + vec(r.total);
    if (r.safe && r.finalWork.some((x, j) => x !== r.total[j])) out += '\nWarning: final Work does not match the total instances. Recheck the addition.';
    else if (r.safe) out += '\nMatch ho gaya, matlab addition sahi hai.';
    out += '\n\nMore than one safe sequence can exist. Any valid one gets marks if the steps (Need matrix and Work after every success) are shown.';
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = F;
  else root.F = F;
})(typeof globalThis !== 'undefined' ? globalThis : this);
