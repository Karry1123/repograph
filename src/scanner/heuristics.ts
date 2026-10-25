import type { CodeNode } from '../types.js';
export const nameTokens = (id: string): string => id.replace(/([a-z0-9])([A-Z])/g, '$1/$2');
export const isUtilityName = (id: string): boolean => /(?:^|[/_.-])(?:utils?|helpers?|common|shared|lib|constants|types|config)(?:[/_.-]|$)/i.test(nameTokens(id));
export const isUtility = (node: CodeNode, threshold = 12): boolean => (node.inDegree > threshold && node.outDegree <= 2) || isUtilityName(node.id);
export const isTestFile = (id: string): boolean => /(?:^|\/)(?:__tests__|tests?|specs?)(?:\/|\.|$)|(?:[._-](?:test|spec))\.[^/]+$|(?:^|\/)test_[^/]+\.py$/i.test(id);
export const isEntryLike = (id: string): boolean => /(?:^|[/_.-])(?:controllers?|routes?|routers?|handlers?|api|endpoints?|cli|app|server|main)(?:[/_.-]|$)/i.test(nameTokens(id)) || /^index\.[^/]+$/.test(id) || /(?:^|\/)(?:__main__|manage)\.py$/.test(id);
