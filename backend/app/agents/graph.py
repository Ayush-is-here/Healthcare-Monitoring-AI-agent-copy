from functools import partial

from langgraph.graph import StateGraph, START, END
from langgraph.graph.state import CompiledStateGraph

from app.agents.state import HealthInsightState
from app.agents.nodes import (
    prompt_node,
    planner_node,
    tool_execution_node,
    generate_response_node,
    parser_node
)

from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter

from app.agents.planner import Planner
from app.agents.tool_executor import ToolExecutor

def build_graph(
        ai_adapter: BaseAIAdapter,
        planner: Planner,
        executor: ToolExecutor
        ) -> CompiledStateGraph:

    graph_builder = StateGraph(HealthInsightState)

    graph_builder.add_node(
        "prompt_node",
        prompt_node
        )

    graph_builder.add_node(
        "planner_node",
        partial(
            planner_node,
            planner=planner
        )
    )

    graph_builder.add_node(
        "tool_execution_node",
        partial(
            tool_execution_node,
            executor=executor
        )
    )
    
    graph_builder.add_node(
        "generate_response_node",
        partial(
            generate_response_node,
            ai_adapter=ai_adapter
            )
        )

    graph_builder.add_node(
        "parser_node",
        parser_node
    )


    graph_builder.add_edge(
        START,
        "prompt_node"
    )

    graph_builder.add_edge(
        "prompt_node",
        "planner_node"
    )

    graph_builder.add_edge(
        "planner_node",
        "tool_execution_node"
    )

    graph_builder.add_edge(
        "tool_execution_node",
        "generate_response_node"
    )

    graph_builder.add_edge(
        "generate_response_node",
        "parser_node"
    )

    graph_builder.add_edge(
        "parser_node",
        END
    )

    graph = graph_builder.compile()

    return graph