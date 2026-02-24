import YAML from 'yaml';

export function parseStructuredDoc(input: string): unknown {
  const trimmed = (input ?? '').trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return YAML.parse(trimmed);
  }
}
