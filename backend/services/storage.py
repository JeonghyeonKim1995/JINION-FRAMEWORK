from __future__ import annotations
import asyncio
import io
import os
import uuid
from datetime import timedelta

from minio import Minio


def _client() -> Minio:
    return Minio(
        endpoint=os.getenv("MINIO_ENDPOINT", "localhost:9000"),
        access_key=os.getenv("MINIO_ACCESS_KEY", ""),
        secret_key=os.getenv("MINIO_SECRET_KEY", ""),
        secure=os.getenv("MINIO_SECURE", "false").lower() == "true",
    )


_BUCKET = os.getenv("MINIO_BUCKET", "uploads")


def _upload_sync(filename: str, data: bytes, content_type: str) -> dict:
    client = _client()
    bucket = os.getenv("MINIO_BUCKET", _BUCKET)

    if not client.bucket_exists(bucket):
        client.make_bucket(bucket)

    ext = filename.rsplit(".", 1)[-1] if "." in filename else ""
    key = f"{uuid.uuid4()}.{ext}" if ext else str(uuid.uuid4())

    client.put_object(
        bucket_name=bucket,
        object_name=key,
        data=io.BytesIO(data),
        length=len(data),
        content_type=content_type,
    )

    expire_days = int(os.getenv("MINIO_URL_EXPIRE_DAYS", "7"))
    url = client.presigned_get_object(bucket, key, expires=timedelta(days=expire_days))

    return {
        "url": url,
        "key": key,
        "name": filename,
        "size": len(data),
        "type": content_type,
    }


async def upload(filename: str, data: bytes, content_type: str) -> dict:
    return await asyncio.to_thread(_upload_sync, filename, data, content_type)
