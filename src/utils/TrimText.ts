export default function TrimText(str: string, len: number): string {
  if (str.length <= len) return str;

  const subStr = str.slice(0, len);
  const lastWsIndex = Math.max(
    subStr.lastIndexOf(' '),
    subStr.lastIndexOf('\n'),
    subStr.lastIndexOf('\t'),
  );

  const cutAt = lastWsIndex > 0 ? lastWsIndex : Math.max(0, len - 1);

  return `${subStr.slice(0, cutAt).trimEnd()}...`;
}
