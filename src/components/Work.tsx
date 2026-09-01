import { useState, useCallback, useEffect, useRef } from "react";
import "./styles/Work.css";
import { MdArrowOutward } from "react-icons/md";

type Project = {
  title: string;
  category: string;
  tools: string;
  image: string;
  link?: string;
  accent: string;
};

const projects: Project[] = [
  {
    title: "AminoArcade",
    category: "Peptide Marketplace & Protocol Tracking",
    tools: "Next.js, TypeScript, Node.js, PostgreSQL, Stripe",
    image: "/images/projects/amino-arcade.jpg",
    accent: "#38a297",
  },
  {
    title: "Fika Duka",
    category: "Retail Distribution, Field Sales & Logistics",
    tools: "React Native, Node.js, PostgreSQL, Maps API",
    image: "/images/projects/fika-duka.jpg",
    link: "https://fikaduka.com",
    accent: "#a78bfa",
  },
  {
    title: "NexSentia",
    category: "Organizational Friction Detection",
    tools: "Next.js, Python, LLMs, RAG, PostgreSQL",
    image: "/images/projects/nexsentia.jpg",
    link: "https://nexsentia.com",
    accent: "#f472b6",
  },
  {
    title: "OFFR",
    category: "Local Deals, Experience Booking & Rewards",
    tools: "React Native, Node.js, PostgreSQL, Stripe",
    image: "/images/projects/offr.jpg",
    link: "https://of-fr.com",
    accent: "#fbbf24",
  },
  {
    title: "Zooni",
    category: "F45 Fitness SaaS Marketplace",
    tools: "Next.js, TypeScript, Node.js, Stripe, AWS",
    image: "/images/projects/zooni.png",
    accent: "#34d399",
  },
  {
    title: "CSPERKS",
    category: "CS2 Match & Inventory Analytics",
    tools: "Next.js, TypeScript, Node.js, Redis, Steam API",
    image: "/images/projects/csperks.png",
    link: "https://csperks.com",
    accent: "#38bdf8",
  },
  {
    title: "VNEXIA",
    category: "AI-Powered Health & Safety",
    tools: "Next.js, Python, LLMs, Computer Vision, AWS",
    image: "/images/projects/vnexia.png",
    link: "https://vnexia.com",
    accent: "#c084fc",
  },
  {
    title: "SENOA",
    category: "Crypto-Native Social Commerce",
    tools: "Next.js, TypeScript, Solidity, wagmi, Node.js",
    image: "/images/projects/senoa.png",
    link: "https://senoaapp.com",
    accent: "#fb923c",
  },
];

const Work = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for staggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, index: number) => {
      const card = cardRefs.current[index];
      if (!card) return;
      const rect = card.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        {/* Section Header */}
        <div className="work-header">
          <div className="work-header-line" />
          <h2>
            Featured <span>Gallery</span>
          </h2>
          <p className="work-subtitle">
            Production platforms spanning marketplaces, logistics, AI tooling,
            and onchain commerce.
          </p>
        </div>

        {/* Project Counter */}
        <div className="work-counter">
          <span className="work-counter-num">{projects.length}</span>
          <span className="work-counter-label">Projects</span>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`gallery-card ${
                visibleCards.has(index) ? "gallery-card--visible" : ""
              } ${activeCard === index ? "gallery-card--active" : ""}`}
              data-index={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              style={
                {
                  "--card-accent": project.accent,
                  "--delay": `${index * 0.08}s`,
                  "--mouse-x": `${mousePos.x}px`,
                  "--mouse-y": `${mousePos.y}px`,
                } as React.CSSProperties
              }
            >
              {/* Glow effect on hover */}
              <div className="gallery-card-glow" />

              {/* Project Number */}
              <div className="gallery-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Image */}
              <div className="gallery-card-image">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                />
                <div className="gallery-card-image-overlay" />
              </div>

              {/* Content */}
              <div className="gallery-card-content">
                <h3 className="gallery-card-title">{project.title}</h3>
                <p className="gallery-card-category">{project.category}</p>

                {/* Tech pills */}
                <div className="gallery-card-tools">
                  {project.tools.split(", ").map((tool, i) => (
                    <span key={i} className="gallery-tool-pill">
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-card-link"
                    data-cursor="disable"
                  >
                    <span>View Project</span>
                    <MdArrowOutward />
                  </a>
                )}
              </div>

              {/* Border accent line */}
              <div className="gallery-card-accent-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
