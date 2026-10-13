/**
 * Canonical per-segment reference-audio access.
 *
 * The editor stores audio in `segment.refAudios`. Older API workflows may
 * place it in `ref_audios` or under `segment.inputs`. Keep the fallback here
 * so loading and serializing a workflow cannot silently discard audio assets.
 */
export function getSegmentRefAudios(segment) {
    if (!segment || typeof segment !== "object") return [];
    const candidates = [
        segment.refAudios,
        segment.ref_audios,
        segment.inputs?.refAudios,
        segment.inputs?.ref_audios,
        segment.inputs?.referenceAudios,
    ];
    const canonical = candidates.find((value) => Array.isArray(value) && value.length > 0);
    if (canonical) return canonical;
    return Array.isArray(segment.refAudios) ? segment.refAudios : [];
}

/** Normalize legacy/nested input into the editor's canonical field in place. */
export function normalizeSegmentRefAudios(segment) {
    if (!segment || typeof segment !== "object") return segment;
    segment.refAudios = getSegmentRefAudios(segment);
    return segment;
}
