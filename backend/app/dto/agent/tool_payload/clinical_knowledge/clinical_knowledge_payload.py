from app.dto.agent.tool_payload.base_tool_payload import BaseToolPayload
from app.dto.agent.tool_payload.clinical_knowledge.research_article import (
    ResearchArticle,
)
from pydantic import Field


class ClinicalKnowledgePayload(BaseToolPayload):

    articles: list[ResearchArticle] = Field(
        default_factory=list
    )

    query_used: str | None = None

    lookup_issues: list[str] = Field(
        default_factory=list
    )