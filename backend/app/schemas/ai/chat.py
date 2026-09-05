from pydantic import BaseModel, Field, ConfigDict





class ChatRequest(BaseModel):

    message: str = Field(
        min_length=1,
        max_length=4000
    )

    model_config = ConfigDict(
        extra="forbid"
    )


class ChatResponse(BaseModel):

    reply: str

    model_config = ConfigDict(
        from_attributes=True
    )