# Active Context

## Current Task
Streamlining the Perplexity Server MCP to provide three specialized tools with automatic model selection based on query complexity.

## Recent Changes
- Refactored codebase to focus on three core tools:
  - search: Quick lookups using Sonar Pro
  - reason: Complex analysis using Sonar Reasoning Pro
  - deep_research: Comprehensive research using Sonar Deep Research
- Implemented intelligent query complexity detection
- Removed chat history and SQLite functionality
- Updated documentation and examples
- Bumped version to 0.2.0

## Key Features
1. Automatic Model Selection:
   - Analyzes query patterns to determine complexity
   - Routes to appropriate model based on analysis
   - Allows manual override with force_model flag

2. Specialized Tools:
   - Each tool optimized for specific use cases
   - Clear separation of concerns
   - Improved response quality through targeted model use

3. Query Analysis:
   - Pattern matching for complexity indicators
   - Research vs reasoning vs simple query detection
   - Intelligent routing to appropriate model

## Implementation Details
- Removed SQLite dependency and chat history
- Simplified server architecture
- Added query complexity detection
- Updated tool schemas and handlers
- Improved error handling and responses
