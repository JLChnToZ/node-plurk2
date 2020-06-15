import * as request from 'request-promise';
import { readFile, writeFile } from 'fs';
import { join as joinPath } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const API_ENDPOINT = 'https://www.plurk.com/API/2/list';

const WRITE_PATH = joinPath(__dirname, '../src/api-parameters.ts');

const isTruthy = Boolean as Function as <T>(value: T) => value is Exclude<T, false | '' | 0 | 0n | null | undefined>;

function mapValues(val: string): string {
  switch(val.trim()) {
    case 'true':
    case 'false':
    case 'null':
      return val;
    case 'PID':
      return 'number';
    default:
      if(Number.isFinite(Number.parseFloat(val)))
        return val;
      return `'${escapeUnsaveCharacters(val)}'`;
  }
}

const unsafeCharacters = /[\0\n\f\n\r\t\v\\'"]/mg;

function escapeUnsaveCharacters(str: string) {
  return str.replace(unsafeCharacters, escapeUnsaveCharactersMap);
}

function escapeUnsaveCharactersMap(src: string) {
  switch(src) {
    case '\r': return '\\r';
    case '\n': return '\\n';
    case '\b': return '\\b';
    case '\t': return '\\t';
    case '\v': return '\\v';
    case '\0': return '\\0';
    case '\\': return '\\\\';
    case '\'': return '\\\'';
    case '\"': return '\\\"';
  }
  return src;
}

function processOptions(options: string, defaultValue: string) {
  if(options)
    return options.split('|').map(mapValues).filter(isTruthy).join(' | ');
  if(!defaultValue)
    return 'any';
  switch(defaultValue.trim()) {
    case 'true':
    case 'false':
      return 'boolean';
    case 'null':
    case 'n/a':
      return 'any';
    case '[]':
      return 'any[]';
    default:
      if(Number.isFinite(Number.parseFloat(defaultValue)))
        return 'number';
      return 'string';
  }
}

function toCapitalize(str: string) {
  return str.length ? str.charAt(0).toUpperCase() + str.substring(1) : str;
}

const colMatcher = /^(\w+)(?:=([^\|:]+(?:\|[^\|:]+)*))?(?:\:(.+))?$/;

function dropOptionsToNamespaces(namespaces: Map<string, any>, path: string, data: string[]): string {
  let pathIdx = path.indexOf('/');
  if(pathIdx >= 0) {
    const ns = toCapitalize(path.substring(0, pathIdx));
    let child = namespaces.get(ns);
    if(!child) {
      child = new Map();
      namespaces.set(ns, child);
    }
    return `${ns}.${dropOptionsToNamespaces(child, path.substring(pathIdx + 1), data)}`;
  } else {
    const results: string[] = [];
    for(const type of data) {
      const m = colMatcher.exec(type);
      if(!m) {
        console.error('WARN: %m does not matches the regexp.', type);
        continue;
      }
      const [, param, options, defaultValue] = m;
      results.push(
        `${
          param
        }${
          defaultValue ? '?' : ''
        }: ${
          processOptions(options, defaultValue)
        };`,
      );
    }
    const ns = `${toCapitalize(path)}Options`;
    namespaces.set(ns, results);
    return ns;
  }
}

function printNamespaces(out: string[], namespaces: Map<string, any>, indent = '') {
  let isFirst = true;
  for(const [name, data] of namespaces) {
    if(!isFirst) out.push('');
    if(Array.isArray(data)) {
      out.push(`${indent}export interface ${name} {`);
      for(const d of data)
        out.push(`${indent}  ${d}`);
    } else {
      out.push(`${indent}export namespace ${name} {`);
      printNamespaces(out, data, indent + '  ');
    }
    out.push(`${indent}}`);
    isFirst = false;
  }
}

async function generateAPIMap() {
  const apiMap: {
    [api: string]: string[];
  } = await request(API_ENDPOINT, { 
    json: true,
  });
  const namespaces = new Map<string, any>();
  const packageJson = JSON.parse(await readFileAsync(joinPath(__dirname, '../package.json'), 'utf8'));
  const results: string[] = [
    `// Generate using ${packageJson?.name}, data from ${API_ENDPOINT}`,
    `// Do not edit manually!`,
    '',
    'export interface APIParameters {',
    '  [api: string]: [any, any];',
  ];
  for(const k in apiMap) {
    if(!(k in apiMap))
      continue;
    const path = k.replace('/APP/', '');
    results.push(
      `  '${escapeUnsaveCharacters(path)}': [`,
      `    ${dropOptionsToNamespaces(namespaces, path, apiMap[k])},`,
      '    any,',
      '  ];'
    );
  }
  results.push('}', '');
  printNamespaces(results, namespaces);
  await writeFileAsync(WRITE_PATH, `${results.join('\n')}\n`);
}

generateAPIMap().catch(
  reason => console.error(reason.stack || reason),
);
