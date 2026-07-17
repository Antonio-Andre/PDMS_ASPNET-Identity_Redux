import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  // Lista de secções para gerar os cartões de acesso rápido
  const navigationCards = [
    {
      title: "Remessas & Encomendas",
      description:
        "Gerir e monitorizar o estado de distribuição e os itens de cada remessa.",
      path: "/shipments", // Se mantiveres a tabela principal na raiz, ou o caminho correto dela
      icon: "📦",
      color: "#007bff",
    },
    {
      title: "Empresas Parceiras",
      description:
        "Visualizar e registar os dados das empresas de processamento e clientes.",
      path: "/companies",
      icon: "🏢",
      color: "#28a745",
    },
    {
      title: "Frota de Vans",
      description:
        "Controlar a atribuição das carrinhas de distribuição e capacidades.",
      path: "/vans",
      icon: "🚚",
      color: "#ffc107",
    },
    {
      title: "Funcionários",
      description: "Gestão da equipa de operadores do sistema e motoristas.",
      path: "/employees",
      icon: "👥",
      color: "#dc3545",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#1e293b", // Azul escuro slate super moderno
          borderRadius: "16px",
          color: "#fff",
          marginBottom: "40px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            margin: "0 0 15px 0",
            fontWeight: "700",
          }}
        >
          Olá, Bem-vindo à Empresa XPTO
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#94a3b8",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Portal Interno de Gestão e Distribuição (PDMS). Selecione uma das
          áreas operacionais abaixo para começar.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {navigationCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "24px",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "16px",
                display: "inline-block",
                padding: "8px",
                backgroundColor: `${card.color}15`, // Cor com 15% de opacidade
                borderRadius: "8px",
              }}
            >
              {card.icon}
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#0f172a",
                fontSize: "1.25rem",
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
