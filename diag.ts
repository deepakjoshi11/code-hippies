import { retrieve } from "@/lib/rag/retriever";
for (const q of ["What happens during discovery?","How do you stop an AI from hallucinating?","Tell me about the Uttarakhand news site","What is your SOC 2 audit report number?","Who won the 2026 general election?","What is the capital of Mongolia?"]) {
  const hits = retrieve(q, 5);
  console.log("\nQ:", q);
  // show unfiltered top by calling with huge topK then printing
  console.log(" kept:", hits.map(h=>`${h.doc}@${h.score.toFixed(3)}`).join(", ") || "(none)");
}
