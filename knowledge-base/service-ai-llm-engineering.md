# Service: AI & LLM engineering

Page: /services/ai-llm-engineering

## What this service is
Retrieval-grounded AI features that answer from your data, not from imagination. RAG systems, AI assistants and LLM-backed workflows built so the model answers from retrieved source documents and says it does not know when nothing relevant is retrieved — with the evaluation harness to prove it.

## What you get
- Retrieval pipeline: chunking strategy, embeddings, vector store, reranking
- Grounded generation — answers cite retrieved chunks or decline
- Refusal path when retrieval returns nothing relevant
- Evaluation harness with a fixed question set, run in CI
- Cost and latency instrumentation per request
- Logged unanswered questions so content gaps become visible

## Technology options
- Models: Anthropic Claude, OpenAI, Open-weight models via vLLM / Ollama
- Retrieval: pgvector, SQLite + vector extension, Managed vector DB, Local lexical index
- Orchestration: TypeScript / Next.js route handlers, Python / FastAPI
- Evaluation: Golden question sets in CI, Retrieval hit-rate metrics, Human review queue

## Typical engagement length
Three to six weeks for a grounded assistant with an evaluation harness.

## The chat widget on this site is the demonstration
The assistant in the corner of this page runs the same architecture I build for clients. It indexes a knowledge base of markdown documents — one per service, one per case study, one for the process and bio — retrieves the most relevant chunks for each question, and answers only from those chunks. Ask it something outside the knowledge base and it says it does not have that information and offers to connect you directly. That is the whole point.

## Grounding reduces hallucination substantially — it does not eliminate it
Anyone selling you a guarantee of zero hallucination is selling you something they cannot deliver. What retrieval grounding does is make the failure mode honest: with no relevant source, the correct behaviour is a refusal rather than an invention, and that behaviour is testable. The evaluation harness runs a fixed question set on every deploy, including questions that should be refused, so a regression in the refusal path is caught by CI rather than by a customer.

## Retrieval quality is the whole game
Most disappointing AI features are not model problems, they are retrieval problems: chunks split mid-sentence, no metadata, one embedding pass and no reranking. The work is unglamorous — chunking on semantic boundaries, keeping document titles attached to their chunks, measuring hit rate against a real question set — and it is where the improvement actually comes from.

## Questions about AI & LLM engineering
### Will the AI make things up about my business?
The system is built so it answers only from documents you control, and refuses when retrieval returns nothing relevant. That reduces fabrication substantially and makes the failure mode a visible refusal rather than a confident invention. It is not an absolute guarantee, and I will not claim it is — which is why the evaluation harness includes questions that must be refused.

### Which model do you use?
Whichever fits the constraint. The retrieval layer and the generation layer are kept separate, so the model is a swappable dependency rather than an architectural commitment.

### What does it cost to run?
Per-request token cost and latency are instrumented from the first build, so you see the running cost before launch rather than in the first invoice. Retrieval and caching are the two levers that actually move it.
