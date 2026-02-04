import { createAxios } from '@vue-nova/utils/axios';
import type { UploadRawFile } from './upload';

export type ChunkUploadOptions = {
  file: UploadRawFile;
  action: string;
  headers: Record<string, string>;
  chunkSize: number;
  concurrency: number;
  retry: number;
  chunkAction?: string;
  mergeAction?: string;
  statusAction?: string;
  onProgress: (percentage: number) => void;
  onError: (err: unknown) => void;
  onSuccess: (res: any) => void;
  controllers: Map<number, Set<AbortController>>;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const getFileId = (rawFile: UploadRawFile) => {
  // 使用文件名 + 大小 + 修改时间作为稳定标识（不需要读完整文件）
  return `${rawFile.name}-${rawFile.size}-${rawFile.lastModified}`;
};

const fetchUploadedChunks = async (fileId: string, statusUrl: string) => {
  const url = `${statusUrl}?fileId=${encodeURIComponent(fileId)}`;
  const res = await fetch(url);
  const data = await res.json();
  return new Set<number>(data.uploadedChunks || []);
};

const requestChunk = (
  chunkUrl: string,
  fileId: string,
  chunkIndex: number,
  totalChunks: number,
  chunkSize: number,
  chunk: Blob,
  rawFile: UploadRawFile,
  onProgress: (loaded: number) => void,
  controller: AbortController,
  headers: Record<string, string>
) =>
  new Promise<void>((resolve, reject) => {
    const formData = new FormData();
    formData.append('fileId', fileId);
    formData.append('chunkIndex', String(chunkIndex));
    formData.append('totalChunks', String(totalChunks));
    formData.append('chunkSize', String(chunkSize));
    formData.append('chunk', chunk, rawFile.name);

    const api = createAxios({ headers });
    api
      .post(chunkUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            onProgress(e.loaded);
          }
        },
        signal: controller.signal,
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });

const mergeChunks = async (
  mergeUrl: string,
  fileId: string,
  filename: string,
  totalChunks: number,
  fileSize: number
) => {
  const res = await fetch(mergeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId, filename, totalChunks, fileSize }),
  });
  if (!res.ok) throw new Error(`merge failed: ${res.status}`);
  return res.json();
};

export const uploadByChunk = async (options: ChunkUploadOptions) => {
  const {
    file,
    action,
    headers,
    chunkSize,
    concurrency,
    retry,
    chunkAction,
    mergeAction,
    statusAction,
    onProgress,
    onError,
    onSuccess,
    controllers,
  } = options;

  const size = file.size;
  const sizePerChunk = Math.max(1, chunkSize);
  const totalChunks = Math.ceil(size / sizePerChunk);
  const fileId = getFileId(file);

  if (!action) {
    throw new Error('chunk upload requires action');
  }

  const baseAction = action.replace(/\/$/, '');
  const chunkUrl = chunkAction || `${baseAction}/chunk`;
  const statusUrl = statusAction || `${baseAction}/status`;
  const mergeUrl = mergeAction || `${baseAction}/merge`;

  // 断点续传：已上传分片
  const uploaded = await fetchUploadedChunks(fileId, statusUrl);

  let uploadedBytes = 0;
  let hasError = false;
  for (const index of uploaded) {
    const start = index * sizePerChunk;
    const end = Math.min(size, start + sizePerChunk);
    uploadedBytes += end - start;
  }

  const maxConcurrency = Math.max(1, concurrency);
  let nextIndex = 0;
  let active = 0;
  const totalToUpload = totalChunks - uploaded.size;
  let completed = 0;

  const run = async (): Promise<void> => {
    while (active < maxConcurrency && nextIndex < totalChunks) {
      const currentIndex = nextIndex++;
      if (uploaded.has(currentIndex)) continue;
      active++;

      const start = currentIndex * sizePerChunk;
      const end = Math.min(size, start + sizePerChunk);
      const chunk = file.slice(start, end);

      const controller = new AbortController();
      if (file.uid) {
        if (!controllers.has(file.uid)) {
          controllers.set(file.uid, new Set());
        }
        controllers.get(file.uid)!.add(controller);
      }

      const tryUpload = async () => {
        let attempt = 0;
        while (attempt <= retry) {
          try {
            await requestChunk(
              chunkUrl,
              fileId,
              currentIndex,
              totalChunks,
              end - start,
              chunk,
              file,
              (loaded) => {
                const total = uploadedBytes + loaded;
                const percentage = (total / size) * 100;
                onProgress(percentage);
              },
              controller,
              headers
            );
            return;
          } catch (err) {
            attempt += 1;
            if (attempt > retry) throw err;
            await sleep(300);
          }
        }
      };

      tryUpload()
        .then(() => {
          uploadedBytes += end - start;
          onProgress((uploadedBytes / size) * 100);
          completed += 1;
        })
        .catch((err) => {
          onError(err);
          hasError = true;
          completed += 1;
        })
        .finally(() => {
          active--;
          if (file.uid) {
            controllers.get(file.uid)?.delete(controller);
          }
          if (nextIndex < totalChunks) {
            run();
          }
        });
    }
  };

  await new Promise<void>((resolve) => {
    if (totalToUpload <= 0) {
      resolve();
      return;
    }
    const timer = setInterval(() => {
      if (completed >= totalToUpload) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
    run();
  });

  if (hasError) {
    throw new Error('chunk upload failed');
  }

  const mergeRes = await mergeChunks(mergeUrl, fileId, file.name, totalChunks, size);
  onSuccess(mergeRes);
};
