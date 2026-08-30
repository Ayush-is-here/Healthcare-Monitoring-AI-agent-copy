

from pydantic import BaseModel


class ResearchArticle(BaseModel):

    pmid: str
    title: str
    abstract: str | None = None
    url: str