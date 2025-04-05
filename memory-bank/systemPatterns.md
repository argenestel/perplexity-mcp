# System Patterns

## Architecture
The Perplexity Server implements a streamlined MCP architecture focused on intelligent query routing:

1. **Server Initialization**
   - Creates MCP server instance
   - Sets up API client with authentication
   - Registers specialized tool handlers

2. **Query Analysis System**
   - Pattern-based complexity detection
   - Intelligent model selection
   - Override capabilities via force_model flag

3. **Tool Specialization**
   - search: Quick lookups (Sonar Pro)
   - reason: Complex analysis (Sonar Reasoning Pro)
   - deep_research: Comprehensive research (Sonar Deep Research)

4. **API Integration**
   - Communicates with Perplexity API
   - Model-specific request handling
   - Structured response formatting

## Key Technical Decisions

1. **Intelligent Routing**
   - Pattern-based query analysis
   - Automatic model selection
   - Manual override capability
   - Optimized response quality

2. **Model Specialization**
   - Sonar Pro: Simple queries
   - Sonar Reasoning Pro: Complex analysis
   - Sonar Deep Research: In-depth research

3. **TypeScript Implementation**
   - Strong typing for tool schemas
   - Enhanced code reliability
   - Better developer experience

4. **Direct Execution**
   - Node.js runtime
   - Local dependency management
   - Simple configuration

5. **Error Handling**
   - Detailed error messages
   - API error conversion
   - Graceful shutdown
   - Query validation

## Communication Patterns

1. **MCP Protocol**
   - Stdio transport
   - Structured request/response
   - Tool schema definitions
   - Input validation

2. **API Communication**
   - RESTful endpoints
   - Model-specific formatting
   - Bearer authentication
   - Error handling

3. **Query Processing**
   - Complexity analysis
   - Model selection
   - Response formatting
   - Context management
