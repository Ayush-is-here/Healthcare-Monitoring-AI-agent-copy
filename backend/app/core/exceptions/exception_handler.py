from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi import status
from app.core.exceptions.ai import  *

async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "status_code": exc.status_code,
                "message": exc.detail
            }
        }
    )

async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError
):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "success": False,
            "error": {
                "status_code": status.HTTP_422_UNPROCESSABLE_CONTENT,
                "message": "Validation failed"
            }
        }
    )

async def general_exception_handler(
        request: Request,
        exc: Exception
):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Internal server error"
            }
        }
    )


async def ai_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, AIProviderException):
        # provider unreachable / timed out — transient, retryable
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        message = "The AI service is temporarily unavailable. Please try again in a moment."
    else:
        # AIResponseParsingException / AIValidationException:
        # the model replied, but the response was unusable
        status_code = status.HTTP_502_BAD_GATEWAY
        message = "The AI service returned an unexpected response. Please try again."

    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {"status_code": status_code, "message": message},
        },
    )