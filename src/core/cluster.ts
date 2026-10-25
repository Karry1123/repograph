import type { CodeNode } from '../types.js';
import { isEntryLike, isUtility, nameTokens } from '../scanner/heuristics.js';
export const LAYER_COLORS: Record<CodeNode['layer'], string> = { entry: '#22d3ee', business: '#e879f9', data: '#fbbf24', util: '#94a3b8', unknown: '#818cf8' };
export function classifyLayer(node: CodeNode): CodeNode['layer'] {
  if (isEntryLike(node.id)) return 'entry';
  if (/(?:^|[/_.-])(?:services?|usecases?|core|domain|logic|managers?)(?:[/_.-]|$)/i.test(nameTokens(node.id))) return 'business';
  if (/(?:^|[/_.-])(?:repos?|repositories|repository|models?|schemas?|entities|entity|stores?|db|dao|migrations?)(?:[/_.-]|$)/i.test(nameTokens(node.id))) return 'data';
  if (isUtility(node)) return 'util';
  return 'unknown';
}
