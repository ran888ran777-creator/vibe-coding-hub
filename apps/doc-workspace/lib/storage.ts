import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

function getStorageClient() {
  if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
    throw new Error("Storage is not configured. Set R2_* env vars.");
  }

  return new S3Client({
    region: "auto",
    endpoint:
      env.R2_ENDPOINT ??
      (env.R2_ACCOUNT_ID ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined),
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY
    }
  });
}

export async function uploadFileToStorage(file: File) {
  const key = `documents/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const arrayBuffer = await file.arrayBuffer();

  if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
    if (!env.DEV_USE_MOCK_SERVICES) {
      throw new Error("Storage is not configured. Set R2_* env vars.");
    }

    const outputPath = path.join(process.cwd(), ".local-storage", key);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, Buffer.from(arrayBuffer));
    return {
      key,
      publicUrl: `local://${key}`
    };
  }

  const client = getStorageClient();

  await client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type || "application/octet-stream"
    })
  );

  const publicUrl = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${key}` : null;
  return { key, publicUrl };
}

export async function createSignedUploadUrl(fileName: string, contentType: string) {
  if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
    if (!env.DEV_USE_MOCK_SERVICES) {
      throw new Error("Storage is not configured. Set R2_* env vars.");
    }

    return {
      key: `documents/${Date.now()}-${fileName.replace(/\s+/g, "-")}`,
      uploadUrl: "local-mock-upload"
    };
  }

  const client = getStorageClient();
  const key = `documents/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      ContentType: contentType
    }),
    { expiresIn: 900 }
  );

  return { key, uploadUrl };
}
