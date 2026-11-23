// Decorative code texture for the About section. Edit freely.
const SOURCE = `const vansh = {
  name: "Vansh",
  role: "AI/ML Engineer & Software Developer",
  studying: {
    degree: "Mathematics and Computing",
    institute: "MITS",
    country: "India",
  },
  focus: [
    "Machine Learning",
    "RAG pipelines",
    "AI applications",
  ],
};

def retrieve(query, index, k=4):
    q = embed(query)
    scores = index @ q
    return top_k(scores, k)

class RAGPipeline:
    def __init__(self, retriever, llm):
        self.retriever = retriever
        self.llm = llm

    def answer(self, question):
        docs = self.retriever(question)
        prompt = build_prompt(question, docs)
        return self.llm(prompt)

softmax(z)_i = exp(z_i) / sum_j exp(z_j)
loss = -sum(y * log(p))
grad = (1/m) * X.T @ (X @ w - y)
cos(a, b) = a . b / (|a| |b|)

for epoch in range(num_epochs):
    for x, y in loader:
        optimizer.zero_grad()
        loss = criterion(model(x), y)
        loss.backward()
        optimizer.step()

export default function Portfolio() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  );
}`;

const lines = SOURCE.split("\n");
const COLUMNS = 4;
const ROWS = 64;

// Each column starts at a different line and wraps around, so the
// four columns read differently while using one source.
export const backgroundColumns = Array.from({ length: COLUMNS }, (_, c) => {
  const start = Math.floor((lines.length / COLUMNS) * c);
  return Array.from(
    { length: ROWS },
    (_, r) => lines[(start + r) % lines.length]
  ).join("\n");
});