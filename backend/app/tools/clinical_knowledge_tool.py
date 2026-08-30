from app.tools.base_tool import BaseTool
from app.dto.agent.tool_payload.tool_result import ToolResult
from app.agents.state import HealthInsightState
from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.tools.enum import ToolType
from app.core.config import settings

import logging

from Bio import Entrez

from app.dto.agent.tool_payload.clinical_knowledge.clinical_knowledge_payload import ClinicalKnowledgePayload
from app.dto.agent.tool_payload.clinical_knowledge.research_article import ResearchArticle


logger = logging.getLogger(__name__)


class ClinicalKnowledgeTool(BaseTool):

    def __init__(
            self,
            ai_adapter: BaseAIAdapter
            ):
        self.ai_adapter = ai_adapter

    def _generate_search_query(
            self,
            prompt: str
            ) -> str:

        query = self.ai_adapter.generate(
            system_instruction="""
You are an expert medical literature retrieval assistant.
Generate ONE concise PubMed search query suitable for the NCBI PubMed search engine.

Return ONLY the query.
Do not explain your reasoning.
""",
user_prompt=prompt
).strip()

        if not query:
            raise ValueError("Failed to generate PubMed search query.")

        return query


    def _build_prompt(
            self,
            state: HealthInsightState
            ) -> str:
         context = state.health_context
         patient = context.patient
         triggered_rules = state.triggered_rules
         medications = context.medications

         metrics = "\n".join(
             [
                 f"- {metric.metric_type}: {metric.value} {metric.unit or ''}"
                 for metric in context.latest_metrics
                 ]
                 )

         rules = "\n".join(
             [
                 f"- {rule.rule_name}"
                 for rule in triggered_rules
                 ]
                 )

         medications_names = "\n".join(
             [
                 f"- {medication.medicine_name}"
                 for medication in medications
                 ]
                 )
         
         return f"""
IMPORTANT:
Generate a search query based Only on the clinical information below.
         
Patient Information:
- Age: {patient.age}
- Gender: {patient.gender}

Triggered Clinical Rules:
{rules if rules else "None"}

Latest Health Metrics (most recent values):
{metrics if metrics else "No metrics available"}

Current Medications:
{medications_names if medications_names else "No current medications"}

Requirements:
- Focus on evidence-based medicine.
- Focus on clinical guidelines and systematic reviews when possible.
- Return ONLY a plain PubMed search query.
  Do not include:
  - quotation marks
  - markdown
  - explanations
  - prefixes such as "Query:"
  - bullet points
""".strip()


    def _search_pubmed(
            self,
            query: str
    ) -> list[str]:

        if not query.strip():
            return[]

        Entrez.email = settings.pubmed_email

        try:

            with Entrez.esearch(
                db="pubmed",
                term=query,
                retmax=5,
                sort="relevance",
                retmode="xml"
            ) as handle:

                response = Entrez.read(handle)

            return response.get("IdList", [])

        except Exception as e:
            raise RuntimeError(
                f"Failed to search PubMed: {e}"
            ) from e


    def _fetch_articles(
            self,
            pmids: list[str]
            ) -> list[ResearchArticle]:
        
        if not pmids:
            return []

        Entrez.email = settings.pubmed_email
        
        try:
            with Entrez.efetch(
                db="pubmed",
                id=",".join(pmids),
                rettype="abstract",
                retmode="xml"
                ) as handle:
                response = Entrez.read(handle)

            articles = []

            for article in response.get("PubmedArticle", []):

                citation = article["MedlineCitation"]

                pmid = str(citation["PMID"])

                article_data = citation["Article"]

                title = article_data.get(
                    "ArticleTitle",
                    "No title available"
                )

                abstract = None

                if "Abstract" in article_data:

                    abstract = " ".join(
                        map(str, article_data["Abstract"]["AbstractText"])
                    )

                articles.append(
                    ResearchArticle(
                        pmid=pmid,
                        title=title,
                        abstract=abstract,
                        url=f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
                        )
                        )

            return articles

        except Exception as e:
            raise RuntimeError(
                f"Failed to fetch PubMed articles: {e}"
            ) from e


    def _build_payload(
            self,
            articles: list[ResearchArticle],
            query_used: str | None = None,
            lookup_issues: list[str] | None = None
    ) -> ClinicalKnowledgePayload:

        return ClinicalKnowledgePayload(
            articles=articles,
            query_used=query_used,
            lookup_issues=lookup_issues or []
        )


    def execute(
            self,
            state: HealthInsightState
            ) -> ToolResult:

        lookup_issues: list[str] = []
        query: str | None = None
        articles: list[ResearchArticle] = []

        prompt = self._build_prompt(state=state)

        # ---------------------------------------------------------
        # 1. Generate the PubMed query
        # ---------------------------------------------------------
        try:
            query = self._generate_search_query(
                prompt=prompt
            )

        except Exception as e:
            lookup_issues.append(
                f"Failed to generate a PubMed search query: {e}"
            )
            logger.warning(
                "Clinical research tool could not generate a query: %s", e
            )

            return ToolResult(
                tool_type=ToolType.CLINICAL_RESEARCH,
                payload=self._build_payload(
                    articles=[],
                    query_used=None,
                    lookup_issues=lookup_issues
                )
            )

        # ---------------------------------------------------------
        # 2. Search PubMed
        # ---------------------------------------------------------
        try:
            pmids = self._search_pubmed(query)

        except RuntimeError as e:
            lookup_issues.append(
                f"PubMed search failed for query '{query}': {e}"
            )
            logger.warning("PubMed search failed: %s", e)
            pmids = []

        if not pmids and not lookup_issues:
            lookup_issues.append(
                f"PubMed returned no matching articles for query "
                f"'{query}'. No external clinical evidence was "
                f"available for this analysis."
            )

        # ---------------------------------------------------------
        # 3. Fetch article details
        # ---------------------------------------------------------
        if pmids:
            try:
                articles = self._fetch_articles(pmids)

            except RuntimeError as e:
                lookup_issues.append(
                    f"Failed to fetch PubMed articles for PMIDs "
                    f"{pmids}: {e}"
                )
                logger.warning("PubMed fetch failed: %s", e)

            if pmids and not articles and not lookup_issues:
                lookup_issues.append(
                    f"PubMed matched {len(pmids)} article(s) but none "
                    f"could be parsed into usable results."
                )

        payload = self._build_payload(
            articles=articles,
            query_used=query,
            lookup_issues=lookup_issues
        )

        logger.info(
            "Clinical research tool finished: %d article(s), %d issue(s).",
            len(articles),
            len(lookup_issues)
        )

        return ToolResult(
            tool_type=ToolType.CLINICAL_RESEARCH,
            payload=payload
        )