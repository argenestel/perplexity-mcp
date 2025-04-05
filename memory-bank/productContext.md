# Product Context

## Purpose
The Perplexity Server is an MCP (Model Context Protocol) server that provides intelligent research and information retrieval through specialized AI models. It automatically analyzes query complexity to route requests to the most appropriate Perplexity AI model, ensuring optimal responses for different types of queries.

## Problems Solved
1. **Query Optimization**: Automatically selects the best AI model based on query complexity
2. **Information Access**: Provides quick answers to simple questions using Sonar Pro
3. **Complex Analysis**: Handles multi-step reasoning and detailed explanations with Sonar Reasoning Pro
4. **Deep Research**: Conducts comprehensive research and analysis using Sonar Deep Research
5. **Efficiency**: Streamlines information retrieval by matching query complexity to model capabilities

## How It Works
The server analyzes queries and routes them to three specialized tools:

1. **search (Sonar Pro)**
   - Quick information lookup
   - Simple factual queries
   - Direct, concise answers
   - Best for straightforward questions

2. **reason (Sonar Reasoning Pro)**
   - Complex problem-solving
   - Multi-step analysis
   - Comparisons and trade-offs
   - Detailed explanations
   - Best for how/why questions

3. **deep_research (Sonar Deep Research)**
   - Comprehensive research
   - In-depth analysis
   - Multiple perspectives
   - Source references
   - Best for complex topics

The server features intelligent query analysis that automatically routes requests to the appropriate model based on complexity patterns, with manual override available through the force_model flag.

## Key Features
1. **Automatic Model Selection**
   - Pattern-based complexity detection
   - Intelligent routing to appropriate model
   - Override capability for manual control

2. **Specialized Response Formats**
   - Concise answers for simple queries
   - Structured analysis for complex questions
   - Comprehensive reports for research topics

3. **Query Analysis**
   - Keyword and pattern detection
   - Complexity assessment
   - Context consideration
   - Model-specific formatting
