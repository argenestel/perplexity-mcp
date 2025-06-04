#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode, } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
if (!PERPLEXITY_API_KEY) {
    throw new Error("PERPLEXITY_API_KEY environment variable is required");
}
class PerplexityServer {
    server;
    axiosInstance;
    constructor() {
        this.server = new Server({
            name: "perplexity-server",
            version: "0.2.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.axiosInstance = axios.create({
            baseURL: "https://api.perplexity.ai",
            headers: {
                "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        this.setupToolHandlers();
        // Error handling
        this.server.onerror = (error) => console.error("[MCP Error]", error);
        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    /**
     * Determines the complexity of a query to choose the appropriate model
     */
    determineQueryComplexity(query) {
        // Check for research indicators
        const researchIndicators = [
            "analyze", "research", "investigate", "study", "examine", "explore",
            "comprehensive", "detailed", "in-depth", "thorough",
            "compare and contrast", "evaluate", "assess"
        ];
        // Check for complex reasoning indicators
        const complexIndicators = [
            "how", "why", "what if", "explain", "solve", "steps to",
            "difference between", "compare", "which is better",
            "pros and cons", "advantages", "disadvantages"
        ];
        const query_lower = query.toLowerCase();
        // Check for research patterns
        if (researchIndicators.some(indicator => query_lower.includes(indicator))) {
            return "research";
        }
        // Check for complex patterns
        if (complexIndicators.some(indicator => query_lower.includes(indicator))) {
            return "complex";
        }
        // Default to simple if no complex/research patterns found
        return "simple";
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "search",
                    description: "Quick search for simple queries using Perplexity's Sonar Pro model. Best for straightforward questions and basic information lookup.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The search query or question"
                            },
                            force_model: {
                                type: "boolean",
                                description: "Optional: Force using this model even if query seems complex",
                                default: false
                            }
                        },
                        required: ["query"]
                    }
                },
                {
                    name: "reason",
                    description: "Handles complex, multi-step tasks using Perplexity's Sonar Reasoning Pro model. Best for explanations, comparisons, and problem-solving.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The complex query or task to reason about"
                            },
                            force_model: {
                                type: "boolean",
                                description: "Optional: Force using this model even if query seems simple/research-oriented",
                                default: false
                            }
                        },
                        required: ["query"]
                    }
                },
                {
                    name: "deep_research",
                    description: "Conducts in-depth analysis and generates detailed reports using Perplexity's Sonar Deep Research model. Best for comprehensive research topics.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The research topic or question to investigate in depth"
                            },
                            focus_areas: {
                                type: "array",
                                items: {
                                    type: "string"
                                },
                                description: "Optional: Specific aspects or areas to focus on"
                            },
                            force_model: {
                                type: "boolean",
                                description: "Optional: Force using this model even if query seems simple",
                                default: false
                            }
                        },
                        required: ["query"]
                    }
                }
            ]
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                const { query, force_model = false } = request.params.arguments;
                // Determine which model to use based on query complexity
                let selectedTool = request.params.name;
                if (!force_model && selectedTool === "search") {
                    const complexity = this.determineQueryComplexity(query);
                    if (complexity === "complex") {
                        selectedTool = "reason";
                    }
                    else if (complexity === "research") {
                        selectedTool = "deep_research";
                    }
                }
                let model;
                let prompt;
                switch (selectedTool) {
                    case "search": {
                        model = "sonar-pro";
                        prompt = `Provide a clear, concise answer to: ${query}`;
                        break;
                    }
                    case "reason": {
                        model = "sonar-reasoning-pro";
                        prompt = `Provide a detailed explanation and analysis for: ${query}. Include:
            1. Step-by-step reasoning
            2. Key considerations
            3. Relevant examples
            4. Practical implications
            5. Potential alternatives`;
                        break;
                    }
                    case "deep_research": {
                        model = "sonar-deep-research";
                        const { focus_areas = [] } = request.params.arguments;
                        prompt = `Conduct comprehensive research on: ${query}`;
                        if (focus_areas.length > 0) {
                            prompt += `\n\nFocus areas:\n${focus_areas.map((area, i) => `${i + 1}. ${area}`).join('\n')}`;
                        }
                        prompt += `\n\nProvide a detailed analysis including:
            1. Background and context
            2. Key concepts and definitions
            3. Current state of knowledge
            4. Different perspectives
            5. Recent developments
            6. Practical applications
            7. Challenges and limitations
            8. Future directions
            9. Expert opinions
            10. References to sources`;
                        break;
                    }
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
                const response = await this.axiosInstance.post("/chat/completions", {
                    model,
                    messages: [{ role: "user", content: prompt }],
                });
                // response.data can have a string[] .citations
                // these are referred to in the return text as numbered citations e.g. [1]
                const sourcesText = response.data.citations
                    ? `\n\n## Sources\nPlease keep the numbered citations inline.\n${response.data.citations
                        .map((c, i) => `${i + 1}: ${c}`)
                        .join("\n")}`
                    : "";
                return {
                    content: [{
                            type: "text",
                            text: response.data.choices[0].message.content + sourcesText,
                        }]
                };
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new McpError(ErrorCode.InternalError, `Perplexity API error: ${error.response?.data?.error?.message || error.message}`);
                }
                throw error;
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Perplexity MCP server running on stdio");
    }
}
const server = new PerplexityServer();
server.run().catch(console.error);
