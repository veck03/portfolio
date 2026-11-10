function ShoppingVisual() {
  return (
    <svg
      className="project-svg"
      viewBox="0 0 800 500"
      role="img"
      aria-label="AI shopping agent interface"
    >
      <rect width="800" height="500" fill="#e9e9e5" />

      <rect
        x="105"
        y="75"
        width="590"
        height="350"
        rx="4"
        fill="#f7f7f4"
        stroke="#c8c8c2"
      />

      <line
        x1="105"
        y1="125"
        x2="695"
        y2="125"
        stroke="#d2d2cc"
      />

      <circle cx="130" cy="100" r="5" fill="#b5b5af" />
      <circle cx="147" cy="100" r="5" fill="#b5b5af" />
      <circle cx="164" cy="100" r="5" fill="#b5b5af" />

      <rect
        x="145"
        y="155"
        width="230"
        height="48"
        rx="3"
        fill="#1b1b1b"
      />

      <text
        x="166"
        y="184"
        fill="#ffffff"
        fontSize="13"
        fontFamily="monospace"
      >
        find laptop for ML
      </text>

      <rect
        x="145"
        y="225"
        width="290"
        height="72"
        rx="3"
        fill="#e3e3de"
      />

      <circle
        cx="170"
        cy="250"
        r="7"
        fill="#5c8d65"
      />

      <text
        x="190"
        y="255"
        fill="#555"
        fontSize="12"
        fontFamily="monospace"
      >
        agent reasoning
      </text>

      <rect
        x="145"
        y="320"
        width="155"
        height="65"
        fill="#deded9"
      />

      <rect
        x="320"
        y="320"
        width="155"
        height="65"
        fill="#deded9"
      />

      <rect
        x="495"
        y="320"
        width="155"
        height="65"
        fill="#deded9"
      />
    </svg>
  );
}


function ResearchVisual() {
  return (
    <svg className="project-svg" viewBox="0 0 800 500" role="img" aria-label="Scientific research retrieval workflow visualization">
      <rect width="800" height="500" fill="#e6e6e1" />
      <rect x="70" y="90" width="190" height="105" rx="4" fill="#f7f7f4" stroke="#bdbdb7" />
      <rect x="70" y="235" width="190" height="105" rx="4" fill="#f7f7f4" stroke="#bdbdb7" />
      <rect x="335" y="160" width="150" height="105" rx="4" fill="#1b1b1b" />
      <rect x="560" y="90" width="175" height="105" rx="4" fill="#f7f7f4" stroke="#bdbdb7" />
      <rect x="560" y="235" width="175" height="105" rx="4" fill="#f7f7f4" stroke="#bdbdb7" />
      <g fill="#777" fontFamily="monospace" fontSize="14">
        <text x="92" y="125">Research papers</text>
        <text x="92" y="270">Ocean data</text>
        <text x="92" y="153" fontSize="10">BM25 + vector search</text>
        <text x="92" y="298" fontSize="10">Structured datasets</text>
        <text x="580" y="125">Reranking</text>
        <text x="580" y="153" fontSize="10">Cross-encoder</text>
        <text x="580" y="270">LLM response</text>
        <text x="580" y="298" fontSize="10">Evidence-based answer</text>
      </g>
      <text x="360" y="205" fill="#fff" fontFamily="monospace" fontSize="13">QUERY</text>
      <text x="350" y="230" fill="#bdbdb7" fontFamily="monospace" fontSize="10">ROUTER</text>
      <g stroke="#858580" strokeWidth="2" fill="none">
        <path d="M260 142 H300 V185 H335" />
        <path d="M260 287 H300 V240 H335" />
        <path d="M485 185 H520 V142 H560" />
        <path d="M485 240 H520 V287 H560" />
      </g>
      <g fill="#858580">
        <circle cx="300" cy="185" r="4" /><circle cx="300" cy="240" r="4" />
        <circle cx="520" cy="142" r="4" /><circle cx="520" cy="287" r="4" />
      </g>
    </svg>
  );
}

function HeatVisual() {
  const cells = Array.from({ length: 100 });

  return (
    <svg
      className="project-svg"
      viewBox="0 0 800 500"
      role="img"
      aria-label="Urban heat research visualization"
    >
      <rect width="800" height="500" fill="#e6e6e1" />

      {cells.map((_, index) => {
        const x = 90 + (index % 10) * 62;
        const y = 55 + Math.floor(index / 10) * 39;

        const opacity =
          0.12 +
          (((index * 13) % 8) / 10);

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width="56"
            height="33"
            fill="#777"
            opacity={opacity}
          />
        );
      })}

      <rect
        x="550"
        y="65"
        width="160"
        height="100"
        fill="#f7f7f4"
        stroke="#c8c8c2"
      />

      <text
        x="570"
        y="90"
        fontSize="11"
        fontFamily="monospace"
        fill="#777"
      >
        URBAN HEAT
      </text>

      <text
        x="570"
        y="130"
        fontSize="28"
        fontFamily="Inter, sans-serif"
        fill="#171717"
      >
        34.7°C
      </text>

      <line
        x1="90"
        y1="455"
        x2="710"
        y2="455"
        stroke="#999"
      />
    </svg>
  );
}

function NeuralVisual() {
  const nodes = [
    [150, 150],
    [150, 250],
    [150, 350],
    [400, 115],
    [400, 200],
    [400, 300],
    [400, 385],
    [650, 200],
    [650, 300]
  ];

  const links = [
    [0, 3],
    [0, 4],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 5],
    [2, 6],
    [3, 7],
    [4, 7],
    [4, 8],
    [5, 8],
    [6, 8]
  ];

  return (
    <svg
      className="project-svg"
      viewBox="0 0 800 500"
      role="img"
      aria-label="Neural network visualization"
    >
      <rect width="800" height="500" fill="#e6e6e1" />

      {links.map(([from, to], index) => (
        <line
          key={index}
          x1={nodes[from][0]}
          y1={nodes[from][1]}
          x2={nodes[to][0]}
          y2={nodes[to][1]}
          stroke="#9e9e99"
          strokeWidth="1.4"
        />
      ))}

      {nodes.map(([x, y], index) => (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r="15"
            fill="#1a1a1a"
          />

          <circle
            cx={x}
            cy={y}
            r="21"
            fill="none"
            stroke="#a9a9a4"
            strokeWidth="1"
          />
        </g>
      ))}

      <text
        x="95"
        y="450"
        fontSize="10"
        fontFamily="monospace"
        fill="#777"
      >
        FORWARD PROPAGATION
      </text>

      <text
        x="585"
        y="450"
        fontSize="10"
        fontFamily="monospace"
        fill="#777"
      >
        BACKPROPAGATION
      </text>
    </svg>
  );
}

function FullStackVisual() {
  return (
    <svg
      className="project-svg"
      viewBox="0 0 800 500"
      role="img"
      aria-label="Full-stack application architecture"
    >
      <rect width="800" height="500" fill="#e8e8e3" />

      <rect
        x="65"
        y="125"
        width="195"
        height="245"
        fill="#f8f8f5"
        stroke="#c5c5bf"
      />

      <rect
        x="302"
        y="85"
        width="195"
        height="325"
        fill="#f8f8f5"
        stroke="#c5c5bf"
      />

      <rect
        x="540"
        y="125"
        width="195"
        height="245"
        fill="#f8f8f5"
        stroke="#c5c5bf"
      />

      <text
        x="92"
        y="155"
        fontFamily="monospace"
        fontSize="11"
        fill="#777"
      >
        REACT
      </text>

      <text
        x="325"
        y="115"
        fontFamily="monospace"
        fontSize="11"
        fill="#777"
      >
        FASTAPI
      </text>

      <text
        x="565"
        y="155"
        fontFamily="monospace"
        fontSize="11"
        fill="#777"
      >
        MONGODB
      </text>

      <line
        x1="260"
        y1="248"
        x2="302"
        y2="248"
        stroke="#999"
        strokeWidth="2"
      />

      <line
        x1="497"
        y1="248"
        x2="540"
        y2="248"
        stroke="#999"
        strokeWidth="2"
      />

      <rect
        x="92"
        y="185"
        width="140"
        height="22"
        fill="#deded9"
      />

      <rect
        x="92"
        y="220"
        width="115"
        height="22"
        fill="#deded9"
      />

      <rect
        x="92"
        y="255"
        width="130"
        height="22"
        fill="#deded9"
      />

      <rect
        x="335"
        y="160"
        width="128"
        height="10"
        fill="#d4d4cf"
      />

      <rect
        x="335"
        y="185"
        width="150"
        height="10"
        fill="#d4d4cf"
      />

      <rect
        x="335"
        y="210"
        width="105"
        height="10"
        fill="#d4d4cf"
      />

      <circle
        cx="638"
        cy="240"
        r="50"
        fill="#dfdfda"
        stroke="#c2c2bd"
      />

      <circle
        cx="638"
        cy="240"
        r="28"
        fill="none"
        stroke="#aaa"
      />
    </svg>
  );
}

function ProjectVisual({ type }) {
  switch (type) {
    case "research":
      return <ResearchVisual />;

    case "shopping":
      return <ShoppingVisual />;

    case "heat":
      return <HeatVisual />;

    case "neural":
      return <NeuralVisual />;

    case "fullstack":
      return <FullStackVisual />;

    default:
      return null;
  }
}

export default ProjectVisual;