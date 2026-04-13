import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const checks = [
  {
    file: "public/covers/ultra-light.jpg",
    minBytes: 5 * 1024,
    minWidth: 600,
    minHeight: 750,
  },
  {
    file: "public/covers/clarity.jpg",
    minBytes: 5 * 1024,
    minWidth: 600,
    minHeight: 750,
  },
  {
    file: "public/covers/layered.jpg",
    minBytes: 5 * 1024,
    minWidth: 600,
    minHeight: 750,
  },
  {
    file: "public/covers/clean.jpg",
    minBytes: 5 * 1024,
    minWidth: 600,
    minHeight: 750,
  },
  {
    file: "public/brand/qr.png",
    minBytes: 2 * 1024,
    minWidth: 256,
    minHeight: 256,
  },
];

const failures = [];

for (const rule of checks) {
  const absolutePath = path.resolve(rule.file);
  try {
    const fileStat = await stat(absolutePath);
    if (fileStat.size < rule.minBytes) {
      failures.push(
        `${rule.file}: file too small (${fileStat.size} bytes < ${rule.minBytes} bytes)`
      );
      continue;
    }

    const metadata = await sharp(absolutePath).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    if (width < rule.minWidth || height < rule.minHeight) {
      failures.push(
        `${rule.file}: dimensions too small (${width}x${height} < ${rule.minWidth}x${rule.minHeight})`
      );
    }
  } catch (error) {
    failures.push(`${rule.file}: ${(error).message}`);
  }
}

if (failures.length > 0) {
  process.stderr.write("Asset quality gate failed:\n\n");
  for (const failure of failures) {
    process.stderr.write(`- ${failure}\n`);
  }
  process.exit(1);
}

process.stdout.write("Asset quality gate passed.\n");
