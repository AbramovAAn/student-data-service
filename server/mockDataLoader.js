import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadMockData() {
  const mockDataPath = path.resolve(__dirname, '../data/mockData.ts');
  const source = await fs.readFile(mockDataPath, 'utf8');

  const executableSource = source
    .replace(/^import .*$/m, '')
    .replace(/export const (\w+): [^=]+ =/g, 'globalThis.$1 =');

  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(executableSource, context, { filename: 'mockData.ts' });

  return context.globalThis;
}
