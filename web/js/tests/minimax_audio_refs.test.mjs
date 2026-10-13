import assert from "node:assert/strict";
import { getSegmentRefAudios, normalizeSegmentRefAudios } from "../minimax_audio_refs.mjs";

const canonical = [{ index: 0, audioFile: "canonical.wav" }];
const legacy = [{ index: 0, audioFile: "legacy.wav" }];
const nested = [{ index: 0, audioFile: "nested.wav" }];

assert.deepEqual(getSegmentRefAudios({ refAudios: canonical, inputs: { refAudios: nested } }), canonical);
assert.deepEqual(getSegmentRefAudios({ ref_audios: legacy }), legacy);
assert.deepEqual(getSegmentRefAudios({ inputs: { refAudios: nested } }), nested);
assert.deepEqual(getSegmentRefAudios({ inputs: { ref_audios: nested } }), nested);
assert.deepEqual(getSegmentRefAudios({ inputs: { referenceAudios: nested } }), nested);

const segment = { refAudios: [], inputs: { refAudios: nested, preserved: true } };
normalizeSegmentRefAudios(segment);
assert.deepEqual(segment.refAudios, nested);
assert.equal(segment.inputs.preserved, true);

const canonicalWins = { refAudios: canonical, ref_audios: legacy, inputs: { refAudios: nested } };
normalizeSegmentRefAudios(canonicalWins);
assert.deepEqual(canonicalWins.refAudios, canonical);

console.log("minimax_audio_refs: PASS");
