---
name: content-video-editor
description: Turn an already rough-cut talking-head video into a 16:9 knowledge-video composition with selectable visual worlds, centered presenter framing, captions, preview frames, a verified final MP4, and independent muted scene clips. Use when an agent must plan or execute animation accompaniment for spoken educational content. Do not use it to claim semantic rough-cutting, social publishing, or capabilities that remain only on the roadmap.
---

# Content Video Editor

Deliver files, not only a storyboard or code.

## Read first

1. Read `../../AGENTS.md` and `../../agent/PROTOCOL.md`.
2. Read `references/job-authoring.md` before creating or changing a job.
3. Read `../../templates/multi-world-editorial/README.md` when using the first template.

## Required workflow

1. Inspect the supplied video, transcript or SRT. Keep facts supplied by the user separate from visual metaphors.
2. Decide where the presenter remains full-screen, appears inside a centered circle, or disappears for a pure animation scene.
3. Write a job matching `../../schemas/video-job.schema.json`. Use short, editorial copy; do not paste every spoken sentence onto screen.
4. Run `pnpm job:prepare -- --job <job.json>`.
5. Run `pnpm preview`. Inspect every scene preview for crop, overflow, contrast, subtitle collision and visual continuity.
6. Revise the job or components until previews pass.
7. Run `pnpm render -- --clips` to create the full video and independent muted clips.
8. Run `pnpm verify`. Only a passing report permits the status `verified`.

## Editing rules

- Treat the input as already rough-cut. This version does not make semantic deletions.
- Never remove speech because it looks redundant without user approval.
- Keep the face centered in circular crops by adjusting `presenter.cropX`, `presenter.cropY`, and `presenter.scale` in the job, not with a one-off hard-coded patch.
- Prefer visual actions and relationships over sentences appearing one after another.
- Use one dominant idea per scene and no more than five points.
- Keep all private media inside ignored runtime or output directories.
- Export the full composition and scene clips; the latter are muted by design for flexible editing.

## Completion response

Report:

- current stage: prepared, previewed, rendered, verified or blocked;
- exact output paths;
- what was visually checked;
- what facts, licenses or human decisions remain;
- the single next action.
