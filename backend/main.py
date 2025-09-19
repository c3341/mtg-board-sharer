
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
import httpx
import logging

# ロギングの設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Scryfall APIのベースURL（念のため）
SCRYFALL_API_DOMAIN = "api.scryfall.com"
SCRYFALL_IMAGE_DOMAIN = "cards.scryfall.io"

@app.get("/api/image-proxy")
async def image_proxy(url: str):
    """
    Scryfallの画像URLを受け取り、その画像をクライアントにストリーミングするプロキシエンドポイント。
    CORSの問題を回避するために使用する。
    """
    # URLの検証：Scryfallのドメインからのリクエストのみを許可する
    if not url or (SCRYFALL_API_DOMAIN not in url and SCRYFALL_IMAGE_DOMAIN not in url):
        logger.warning(f"Invalid image URL requested: {url}")
        raise HTTPException(status_code=400, detail="Invalid or missing URL. Only Scryfall image URLs are allowed.")

    try:
        async with httpx.AsyncClient() as client:
            logger.info(f"Requesting image from: {url}")
            # Scryfallに対して画像をリクエスト
            response = await client.get(url, follow_redirects=True)
            response.raise_for_status()  # HTTPエラーがあれば例外を発生させる

            # レスポンスヘッダーを準備（Content-Typeを元の画像から引き継ぐ）
            content_type = response.headers.get('Content-Type', 'application/octet-stream')
            headers = {
                'Content-Type': content_type,
                'Content-Length': response.headers.get('Content-Length')
            }

            # StreamingResponseを使ってクライアントに画像を返す
            return StreamingResponse(response.iter_bytes(), headers=headers)

    except httpx.RequestError as e:
        logger.error(f"Error requesting image from Scryfall: {e}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch image from upstream server: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred in image_proxy: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

# ルートパスへの簡単な挨拶
@app.get("/")
def read_root():
    return {"message": "Welcome to the MTG Board Sharer Backend!"}
