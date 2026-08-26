#!/usr/bin/env node
/**
 * validate-provenance.mjs — P007 SMARTER Acuity
 *
 * Repo destination: apps/P007-smarter-acuity/tools/validate-provenance.mjs
 *
 * The GATE. Checks mapping to rules in source/PROVENANCE.md §6.
 * Exit 0 = clean. Exit 1 = refuse.
 *
 * Usage: node tools/validate-provenance.mjs [--root <monorepo-root>]
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const ROOT = resolve(args[args.indexOf("--root") + 1] ?? ".");
const PROJ = join(ROOT, "apps/P007-smarter-acuity");

const failures = [];
const warnings = [];
const fail = (rule, msg) => failures.push(`[${rule}] ${msg}`);
const warn = (msg) => warnings.push(`[warn] ${msg}`);

const readJson = (p) => {
  if (!existsSync(p)) { fail("IO", `missing required file: ${p}`); return null; }
  try { return JSON.parse(readFileSync(p, "utf8")); }
  catch (e) { fail("IO", `unparseable JSON at ${p}: ${e.message}`); return null; }
};

const corpus   = readJson(join(ROOT, "corpus/corpus.json"))      ?? { entries: [] };
const claims   = readJson(join(PROJ, "source/claims/claims.json")) ?? { claims: [] };
const manifest = readJson(join(PROJ, "source/manifest.json"))      ?? { snapshots: [], derived: [] };

const sourceById = new Map((corpus.entries ?? []).map((e) => [e.id, e]));
const claimById  = new Map((claims.claims ?? []).map((c) => [c.id, c]));

const corpusPath = join(ROOT, "corpus/corpus.json");
if (existsSync(corpusPath)) {
  const actual = createHash("sha256").update(readFileSync(corpusPath)).digest("hex");
  for (const [label, ref] of [["claims ledger", claims.corpus_ref], ["manifest", manifest.corpus_ref]]) {
    if (!ref) continue;
    if (!ref.sha256) {
      warn(`${label} pins no corpus sha256. Permitted while seeding; stamp it before the first derived artifact or the corpus can move underneath you unnoticed.`);
    } else if (ref.sha256 !== actual) {
      fail("CORPUS", `${label} was validated against corpus ${ref.sha256.slice(0, 12)}… but /corpus/corpus.json now hashes to ${actual.slice(0, 12)}…. The shared corpus changed. Re-verify affected claims and re-stamp with operator GO — do not simply update the hash.`);
    }
  }
}

const DERIVED_TREE = /(^|\/)(pages|manuscripts|snapshots|ebooks)\//;
for (const e of corpus.entries ?? []) {
  if (e.local_path && DERIVED_TREE.test(e.local_path)) {
    fail("R2", `corpus entry ${e.id} points at derived output (${e.local_path}). Sources may never be project output — this is the circularity the model exists to prevent.`);
  }
}

for (const e of corpus.entries ?? []) {
  if (e.tier === 2 && (!e.credentialing || e.credentialing.trim().length < 12)) {
    fail("TIER2", `corpus entry ${e.id} is tier 2 without nameable credentialing. If the credential cannot be stated in a sentence, re-tier it to 3.`);
  }
  if (e.tier === 1 && !e.identifier) {
    warn(`tier 1 entry ${e.id} has no identifier — a primary source a reader cannot locate is not neutral ground.`);
  }
}

for (const c of claims.claims ?? []) {
  const tiers = [];
  const supportSources = [];

  for (const s of c.support ?? []) {
    if (!/^SRC-[A-Z0-9-]+$/.test(s.source_id ?? "")) {
      fail("R1", `claim ${c.id} cites "${s.source_id}", which is not a corpus source ID. Claims may cite corpus entries only — never pages, manuscripts, snapshots, or other claims.`);
      continue;
    }
    const src = sourceById.get(s.source_id);
    if (!src) { fail("REF", `claim ${c.id} cites unknown source ${s.source_id}.`); continue; }
    tiers.push(src.tier);
    supportSources.push(src);
    if (!s.locator || /^TODO: SOURCE/.test(s.locator)) {
      if (c.status !== "TODO: SOURCE") {
        fail("LOCATOR", `claim ${c.id} has an unresolved locator for ${s.source_id} but status is "${c.status}". Mark the claim TODO: SOURCE or resolve the locator.`);
      }
    }
  }

  if (c.load_bearing === true && !tiers.some((t) => t === 1 || t === 2)) {
    fail("R4", `claim ${c.id} is load-bearing with no tier 1 or tier 2 support. This is the exact failure mode the model was built to refuse: a tier 3 source carrying a factual claim.`);
  }

  // Load-bearing claims may not rest on unconfirmed sources.
  // verification_status must be "verified" for every support source when load_bearing is true.
  if (c.load_bearing === true) {
    for (const src of supportSources) {
      const vs = src.verification_status;
      if (vs === "operator-to-confirm" || vs === "TODO: SOURCE" || !vs) {
        fail("CONFIRM", `load-bearing claim ${c.id} cites ${src.id} with verification_status "${vs || "(missing)"}". Open the source, pin the locator, and mark it verified before this claim can load-bear.`);
      }
    }
  }

  if (c.kind === "interpretive") {
    if (!c.contested_by?.trim()) fail("R5", `interpretive claim ${c.id} does not name its strongest counter-position.`);
    if (!c.response?.trim())     fail("R5", `interpretive claim ${c.id} names no response to the counter-position.`);
  }
}

const today = new Date().toISOString().slice(0, 10);
const hasDerived = (manifest.derived ?? []).length > 0;
for (const s of manifest.snapshots ?? []) {
  if (s.commit_sha === null && hasDerived) {
    fail("SNAP", `snapshot ${s.id} has a null commit_sha while derived artifacts exist. Null is permitted only before content work begins — a published page must be able to state which manuscript version it corresponded to.`);
  }
  if (s.freeze_until && s.freeze_until < today && s.resync_state === "fresh") {
    fail("SNAP", `snapshot ${s.id} is past freeze_until (${s.freeze_until}) but still marked fresh. Re-take it or mark it stale.`);
  }
}

const PUBLISHABLE = new Set(["release-candidate", "published"]);
for (const d of manifest.derived ?? []) {
  for (const id of d.derives_from ?? []) {
    const c = claimById.get(id);
    if (!c) { fail("REF", `artifact ${d.artifact} references unknown claim ${id}.`); continue; }
    if (PUBLISHABLE.has(d.publish_state) && c.status !== "verified") {
      fail("TODO", `artifact ${d.artifact} is ${d.publish_state} but depends on claim ${id} with status "${c.status}". Unverified claims never reach a publishable artifact.`);
    }
  }
  if (d.snapshot_ref) {
    const snap = (manifest.snapshots ?? []).find((s) => s.id === d.snapshot_ref);
    if (!snap) fail("REF", `artifact ${d.artifact} references unknown snapshot ${d.snapshot_ref}.`);
    else if (snap.resync_state === "expired") fail("SNAP", `artifact ${d.artifact} rests on expired snapshot ${snap.id}.`);
    else if (snap.resync_state === "stale" && PUBLISHABLE.has(d.publish_state)) {
      fail("SNAP", `artifact ${d.artifact} is ${d.publish_state} on a stale snapshot. Stale blocks publishing, not reading.`);
    }
  }
  if (d.voice_check === "fail") fail("VOICE", `artifact ${d.artifact} failed the voice check.`);
}

const VOICE_PATTERNS = [
  { re: /\b(?:is|are|was|were|it['’]s)\s+not\s+(?:just\s+)?[^.,;!?]{1,60}?,?\s+(?:it['’]s|they['’]re|but)\s+/gi,
    label: '"X is not Y, it\'s Z" construction' },
  { re: /\bnot\s+(?:just|merely|only)\s+[^.,;!?]{1,60}?[—–-]\s*(?:it['’]s|but)\s+/gi,
    label: '"not just X — it\'s Y" construction' },
];
const TEXT_EXT = /\.(md|mdx|txt|html)$/i;
const SKIP_DIR = /(^|\/)(node_modules|\.git|dist|build)$/;

const walk = (dir, out = []) => {
  if (!existsSync(dir) || SKIP_DIR.test(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP_DIR.test(p)) walk(p, out); }
    else if (TEXT_EXT.test(name)) out.push(p);
  }
  return out;
};

for (const f of walk(join(PROJ, "pages")).concat(walk(join(PROJ, "content")))) {
  const text = readFileSync(f, "utf8");
  for (const { re, label } of VOICE_PATTERNS) {
    re.lastIndex = 0;
    const m = re.exec(text);
    if (m) fail("VOICE", `${f}: ${label} — "${m[0].trim().slice(0, 70)}…"`);
  }
}

for (const w of warnings) console.warn(w);
if (failures.length) {
  console.error(`\nPROVENANCE GATE: REFUSED (${failures.length})\n`);
  for (const f of failures) console.error("  " + f);
  console.error("\nSee source/PROVENANCE.md §6 for the rule table.\n");
  process.exit(1);
}
console.log(`PROVENANCE GATE: PASS — ${sourceById.size} sources, ${claimById.size} claims, ${(manifest.derived ?? []).length} derived artifacts.`);
