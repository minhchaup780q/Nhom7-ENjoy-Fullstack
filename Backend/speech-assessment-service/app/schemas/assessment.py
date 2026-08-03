from pydantic import BaseModel
from typing import List, Literal

class WordDetail(BaseModel):
    word: str
    status: Literal["correct", "wrong"]

class AssessmentResponse(BaseModel):
    isAllCorrect: bool
    accuracyScore: float
    recognizedText: str
    details: List[WordDetail]
