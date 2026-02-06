/**
 * Convert all JS data files to JSON for Laravel seeders.
 *
 * Usage:  node convert_data.js
 *
 * Input:  ../data_150.js, ../sentences.js, ../grammatika.js,
 *         ../verbs.js, ../verb_sentences.js, ../padej_mashq.js
 *
 * Output: backend/database/seeders/data/*.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(__dirname, 'backend/database/seeders/data');

// Ensure output directory exists
fs.mkdirSync(OUT, { recursive: true });

/**
 * Read a JS file, eval it in a controlled scope, and return the requested
 * variable(s).
 *
 * @param {string} filename  - basename inside ROOT
 * @param {string[]} varNames - variable names to extract
 * @returns {Object} map of varName -> value
 */
function extractVars(filename, varNames) {
    const filePath = path.join(ROOT, filename);
    const code = fs.readFileSync(filePath, 'utf-8');

    // Build a wrapper that declares each variable in scope, runs the file
    // code, then returns them as an object.
    const returnObj = varNames.map(v => `${v}: ${v}`).join(', ');
    const wrapped = `
        ${code}
        return { ${returnObj} };
    `;

    // Use Function() so we don't pollute the global scope.
    const fn = new Function(wrapped);
    return fn();
}

/**
 * Write a value as pretty-printed JSON.
 */
function writeJSON(filename, data) {
    const outPath = path.join(OUT, filename);
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    const stats = fs.statSync(outPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  -> ${outPath} (${sizeKB} KB)`);
}

// -- 1. data_150.js -> words.json ---------------------------------------------
console.log('Converting data_150.js ...');
const { DATA } = extractVars('data_150.js', ['DATA']);
const words = DATA.map((item, idx) => {
    const [noun, gender, uzNoun, uzNounPlural, adjectives] = item;
    return {
        id: idx + 1,
        noun,
        gender,
        uz_noun: uzNoun,
        uz_noun_plural: uzNounPlural,
        adjectives: adjectives.map(adj => {
            const [adjective, uzAdj, cases] = adj;
            const [sgCases, plCases] = cases;
            const caseNames = [
                'nominative', 'genitive', 'dative',
                'accusative', 'instrumental', 'prepositional'
            ];
            const singular = {};
            const plural = {};
            caseNames.forEach((c, i) => {
                singular[c] = sgCases[i];
                plural[c] = plCases[i];
            });
            return {
                adjective,
                uz_adjective: uzAdj,
                singular,
                plural
            };
        })
    };
});
writeJSON('words.json', words);

// -- 2. sentences.js -> sentences.json ----------------------------------------
console.log('Converting sentences.js ...');
const { SENTENCES } = extractVars('sentences.js', ['SENTENCES']);
const sentences = SENTENCES.map((s, idx) => ({
    id: idx + 1,
    word_index: s.wI,
    adjective_index: s.aI,
    case_index: s.cI,
    is_plural: s.pl,
    sentence: s.sentence,
    answer: s.answer
}));
writeJSON('sentences.json', sentences);

// -- 3. grammatika.js -> grammar.json -----------------------------------------
console.log('Converting grammatika.js ...');
const { GRAMMAR_CASES } = extractVars('grammatika.js', ['GRAMMAR_CASES']);
writeJSON('grammar.json', GRAMMAR_CASES);

// -- 4. verbs.js -> verbs.json ------------------------------------------------
console.log('Converting verbs.js ...');
const { VERBS } = extractVars('verbs.js', ['VERBS']);
const verbs = VERBS.map((v, idx) => ({
    id: idx + 1,
    ...v
}));
writeJSON('verbs.json', verbs);

// -- 5. verb_sentences.js -> verb_sentences.json ------------------------------
console.log('Converting verb_sentences.js ...');
const { VERB_SENTENCES } = extractVars('verb_sentences.js', ['VERB_SENTENCES']);
const verbSentences = VERB_SENTENCES.map((s, idx) => ({
    id: idx + 1,
    verb_index: s.vI,
    aspect: s.asp,
    tense: s.tense,
    person_index: s.pIdx,
    sentence: s.sentence,
    answer: s.answer
}));
writeJSON('verb_sentences.json', verbSentences);

// -- 6. padej_mashq.js -> exercises.json --------------------------------------
console.log('Converting padej_mashq.js ...');
const padejData = extractVars('padej_mashq.js', [
    'PADEJ_NAMES', 'MASHQ_WORDS', 'PADEJ_SENTENCES'
]);
const exercises = {
    case_names: padejData.PADEJ_NAMES,
    words: padejData.MASHQ_WORDS.map((w, idx) => ({
        id: idx + 1,
        ...w
    })),
    sentences: padejData.PADEJ_SENTENCES.map((s, idx) => ({
        id: idx + 1,
        ...s
    }))
};
writeJSON('exercises.json', exercises);

// -- Summary ------------------------------------------------------------------
console.log('\nDone! All JSON files written to:');
console.log(`  ${OUT}\n`);

// Quick validation: try parsing each JSON file back
const jsonFiles = fs.readdirSync(OUT).filter(f => f.endsWith('.json'));
let allValid = true;
for (const f of jsonFiles) {
    try {
        const content = fs.readFileSync(path.join(OUT, f), 'utf-8');
        JSON.parse(content);
        console.log(`  [OK] ${f}`);
    } catch (err) {
        console.error(`  [FAIL] ${f}: ${err.message}`);
        allValid = false;
    }
}

if (allValid) {
    console.log('\nAll JSON files are valid.');
} else {
    console.error('\nSome JSON files failed validation!');
    process.exit(1);
}
