# Frequently asked questions: AI & LLM

Page: /faq

## What can the AI assistant on this site actually answer?
It answers from a knowledge base of documents about the services, the case studies, the process and the pricing models on this site. Ask it something outside that and it will tell you it does not have the information and offer to connect you on WhatsApp, rather than guessing.

## Will an AI assistant make things up about my business?
A retrieval-grounded assistant answers only from documents you control and refuses when nothing relevant is retrieved. That reduces fabrication substantially and turns the failure mode into a visible refusal rather than a confident invention. It is not an absolute guarantee, and I will not sell it as one — which is exactly why the evaluation harness includes questions that must be refused, run on every deploy.

## What does it cost to run an AI feature?
Per-request token cost and latency are instrumented from the first build, so you see the running cost before launch rather than in your first invoice. Retrieval quality and caching are the two levers that actually move it — a well-built retrieval layer sends far fewer tokens to the model.

## Which AI model do you use?
Whichever fits the constraint — cost, latency, data residency, quality. The retrieval layer and the generation layer are kept separate, so the model stays a swappable dependency rather than an architectural commitment you are locked into.
