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

/**
 * Canonicalize timeline_data at the ComfyUI widget boundary.
 *
 * ComfyUI restores widget values before the Motion Director editor exists and
 * exports those raw values again. Normalize here as well as in the editor so a
 * load/save round-trip cannot discard nested audio references.
 */
export function normalizeTimelineAudioRefs(raw) {
    if (typeof raw !== "string" || !raw.trim()) return raw;
    let timeline;
    try {
        timeline = JSON.parse(raw);
    } catch {
        return raw;
    }
    if (!timeline || typeof timeline !== "object" || Array.isArray(timeline)) return raw;
    for (const segment of timeline.segments || []) normalizeSegmentRefAudios(segment);
    return JSON.stringify(timeline);
}
