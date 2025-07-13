"""Pydantic representation of an n8n workflow JSON."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class CredentialReference(BaseModel):
    """Reference to a saved credential in n8n."""
    id: str
    name: str


class Node(BaseModel):
    """Single node inside the workflow."""
    id: str
    name: str
    webhookId: Optional[str] = None
    disabled: bool = False
    notesInFlow: bool = False
    notes: Optional[str] = None

    type: str
    typeVersion: int

    executeOnce: bool = False
    alwaysOutputData: bool = False
    retryOnFail: bool = False
    maxTries: int = 0
    waitBetweenTries: int = 0
    continueOnFail: bool = False
    onError: str = "stopWorkflow"

    # Canvas position -- always two numbers [x, y]
    position: List[int] = Field(min_items=2, max_items=2)

    # Generic key/value stores for each node
    parameters: Dict[str, Any] = Field(default_factory=dict)
    credentials: Dict[str, CredentialReference] = Field(
        default_factory=dict,
        description="Credential map, keyed by credential type",
    )

    class Config:
        extra = "allow"          # tolerate future n8n fields
        allow_population_by_field_name = True


class ConnectionReference(BaseModel):
    """A single edge in the workflow graph."""
    node: str
    type: str
    index: int


class Connections(BaseModel):
    """All edges in the workflow, grouped by channel (main, error, etc.)."""
    main: List[ConnectionReference]

    class Config:
        extra = "allow"          # allow `"error": [...]`, `"trigger": [...]`, etc.


class Settings(BaseModel):
    """Workflow-level execution settings (matches n8n UI)."""
    saveExecutionProgress: Optional[bool] = None
    saveManualExecutions: Optional[bool] = None
    saveDataErrorExecution: Optional[str] = None
    saveDataSuccessExecution: Optional[str] = None
    executionTimeout: Optional[int] = None
    errorWorkflow: Optional[str] = None
    timezone: Optional[str] = None
    executionOrder: Optional[str] = None

    class Config:
        extra = "allow"          # future settings won’t break parsing


class StaticData(BaseModel):
    """Opaque static data stored by n8n (e.g. `lastId`)."""
    lastId: int

    class Config:
        extra = "allow"


class Workflow(BaseModel):
    """Top-level n8n workflow model suitable for CrewAI `output_pydantic`."""
    name: str
    nodes: List[Node]
    connections: Connections
    settings: Optional[Settings] = None
    staticData: Optional[StaticData] = None

    class Config:
        extra = "allow"
