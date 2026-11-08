// Headless tests for the puzzle engine embedded in index.html.
// Run: npm test   (or: node tests/engine.test.js)
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const Engine = new Function(src + ';return Engine;')();
const gen = level => new Promise(r => Engine.generate(level, r));
const PER_LEVEL = Number(process.env.PUZZLES || 4);
const expected = { easy: [1], medium: [2], hard: [3, 4] };

(async () => {
  for (const level of ['easy', 'medium', 'hard']) {
    for (let k = 0; k < PER_LEVEL; k++) {
      const g = await gen(level);
      assert.strictEqual(Engine.search(g.puzzle, 2, false).count, 1, 'puzzle must have a unique solution');
      assert.ok(expected[level].includes(g.grade), `${level} puzzle graded ${g.grade}`);
      // Solve the puzzle by following the coach's hints only
      const board = g.puzzle.slice(), given = board.map(v => v > 0);
      for (let guard = 0; board.includes(0); guard++) {
        assert.ok(guard < 200, 'coach got stuck');
        const steps = Engine.buildHint(board, g.solution, given);
        const last = steps[steps.length - 1];
        steps.forEach(s => assert.ok(!/undefined|NaN/.test(s.text + s.nudge), 'bad hint text: ' + s.text));
        assert.strictEqual(last.kind, 'place');
        assert.strictEqual(last.digit, g.solution[last.cell], `wrong hint from ${last.tech}`);
        board[last.cell] = last.digit;
      }
    }
    console.log(`✓ ${level}: ${PER_LEVEL} puzzles generated, graded and solved by the coach`);
  }
  // A wrong entry must be flagged before any other hint
  const g = await gen('easy'), b = g.puzzle.slice(), i = b.indexOf(0);
  b[i] = (g.solution[i] % 9) + 1;
  assert.strictEqual(Engine.buildHint(b, g.solution, g.puzzle.map(v => v > 0))[0].kind, 'mistake');
  console.log('✓ mistakes are detected');
})().catch(e => { console.error('✗', e.message || e); process.exit(1); });
