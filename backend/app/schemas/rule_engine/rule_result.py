from pydantic import BaseModel, ConfigDict



class RuleResult(BaseModel):

    triggered: bool 
    rule_name: str
    reason: str

    model_config = ConfigDict(
        from_attributes=True
    )