/* eslint-disable */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineEventHandler } from 'h3';

type CanonNode = {
  name: string;
  full: string;
  label: string;
  description?: string;
  terms?: string[];
  children?: CanonNode[];
};

type UiNode = {
  name: string;
  path: string;
  kind: 'object' | 'array' | 'group' | 'string';
  description?: string;
  children: UiNode[];
};

function isEnumsNode(name: string): boolean {
  return /Enums$/.test(name);
}

function classifyKind(n: CanonNode): 'object' | 'array' | 'group' {
  if (n.name.endsWith('[]')) return 'array';
  if (isEnumsNode(n.name)) return 'group';
  return 'object';
}

function expand(n: CanonNode): UiNode | null {
  // drop entire node if it's an Enums group
  if (isEnumsNode(n.name)) return null;

  // expand structural children first (and filter out any Enums groups)
  const structural: UiNode[] = [];
  for (const c of n.children ?? []) {
    const ex = expand(c);
    if (ex) structural.push(ex);
  }

  // then promote every term into a leaf slot (no children!)
  const terms: UiNode[] = (n.terms ?? []).map((t) => ({
    name: t,
    path: `${n.full}.${t}`,
    kind: 'string',
    children: [], // ensure leaf
  }));

  const ui: UiNode = {
    name: n.label || n.name,
    path: n.full,
    kind: classifyKind(n),
    description: n.description,
    children: [...structural, ...terms],
  };

  // absolute safety: leafs never carry children
  if (ui.kind === 'string') ui.children = [];

  return ui;
}

export default defineEventHandler(async () => {
  const p = join(process.cwd(), 'assets', 'data', 'schemaTree.json');
  const raw = await readFile(p, 'utf-8');
  const arr = JSON.parse(raw) as CanonNode[];

  const root = Array.isArray(arr) && arr.length ? arr[0] : null;
  if (!root) {
    return {
      name: 'MovingImageRecord',
      path: 'MovingImageRecord',
      kind: 'object',
      children: [],
    } as UiNode;
  }
  return expand(root);
});
