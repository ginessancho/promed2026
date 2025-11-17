// Compact, horizontal AS-IS vs TO-BE comparison with enhanced colors for animation
export const comparisonDiagram = `
graph LR
    subgraph ASIS["❌ PROCESO ACTUAL (AS-IS)"]
        direction LR
        A1[F-007<br/>Manual] --> A2[Odoo<br/>Manual]
        A2 --> A3[NAF<br/>Manual]
        A3 --> A4{Errores?}
        A4 -->|Sí| A5[Reproceso]
        A5 --> A1
        A4 -->|No| A6[Dashboard]
    end
    
    subgraph TOBE["✅ PROCESO PROPUESTO (TO-BE)"]
        direction LR
        B1[Odoo<br/>Cotización] --> B2[Validación<br/>Automática]
        B2 --> B3{Válido?}
        B3 -->|No| B4[Alerta<br/>Inmediata]
        B4 --> B1
        B3 -->|Sí| B5[Sync<br/>NAF]
        B5 --> B6[Dashboard]
    end
    
    style ASIS fill:#ffe6e6,stroke:#ff4444,stroke-width:2px
    style TOBE fill:#e6ffe6,stroke:#44ff44,stroke-width:2px
    style A1 fill:#ffcccc,stroke:#ff6666
    style A2 fill:#ffcccc,stroke:#ff6666
    style A3 fill:#ffcccc,stroke:#ff6666
    style A5 fill:#ff9999,stroke:#ff4444
    style A4 fill:#FFD700,stroke:#FFA500
    style B2 fill:#90EE90,stroke:#228B22
    style B5 fill:#90EE90,stroke:#228B22
    style B3 fill:#FFD700,stroke:#FFA500
`;

export const architectureDiagram = `
graph LR
    subgraph UI["🖥️ Interfaz"]
        A[Odoo Web]
    end
    
    subgraph ODOO["📦 Odoo"]
        B[Ventas]
        C[Facturación]
        D[Módulo<br/>Integración]
    end
    
    subgraph DMS["🤖 DMS"]
        E[Validador]
        F[Reglas<br/>Negocio]
        G[Mapper]
    end
    
    subgraph EXT["🏢 Sistemas"]
        H[NAF<br/>Oracle]
    end
    
    A --> B
    A --> C
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    
    style D fill:#FFD700,stroke:#FF8800,stroke-width:3px
    style E fill:#90EE90,stroke:#228B22,stroke-width:2px
    style F fill:#90EE90,stroke:#228B22,stroke-width:2px
    style G fill:#90EE90,stroke:#228B22,stroke-width:2px
    style H fill:#87CEEB,stroke:#4682B4,stroke-width:2px
`;

export const flowDiagram = `
graph LR
    A1[Odoo:<br/>Cotización] --> A2[Odoo:<br/>Orden Venta]
    A2 --> A3[Odoo:<br/>Factura]
    A3 --> A4[DMS:<br/>Validación]
    A4 --> A5{Válido?}
    A5 -->|Sí| A6[DMS:<br/>Enriquecimiento]
    A5 -->|No| A7[DMS:<br/>Alerta]
    A7 --> A3
    A6 --> A8[DMS:<br/>Sync NAF]
    A8 --> A9[NAF:<br/>Registro]
    A9 --> A10[Dashboard]
    
    style A4 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A5 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style A6 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A8 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A9 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A7 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
`;

export const businessRulesDiagram = `
graph LR
    A[Factura] --> B{Campos<br/>Críticos?}
    B -->|OK| C{Marca<br/>Única?}
    B -->|Error| E1[❌ Alerta]
    C -->|OK| D{Comodato<br/>Válido?}
    C -->|Error| E2[❌ Alerta]
    D -->|OK| F{Ganancia<br/>Correcta?}
    D -->|Error| E3[❌ Alerta]
    F -->|OK| G[✅ Sync NAF]
    F -->|Error| E4[❌ Alerta]
    
    E1 --> A
    E2 --> A
    E3 --> A
    E4 --> A
    
    style B fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style C fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style D fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style F fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style G fill:#90EE90,stroke:#228B22,stroke-width:3px
    style E1 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style E2 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style E3 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style E4 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
`;

export const asIsDiagram = `
graph LR
    B1[F-007:<br/>Manual] --> B2[Especialista:<br/>Revisión]
    B2 --> B3[Odoo:<br/>Manual]
    B3 --> B4[Facturación:<br/>Revisión]
    B4 --> B5[NAF:<br/>Manual]
    B5 --> B6{Errores?}
    B6 -->|Sí| B7[Reproceso]
    B7 --> B3
    B6 -->|No| B8[Dashboard]
    
    style B1 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style B3 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style B5 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style B7 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style B6 fill:#FFD700,stroke:#FFA500,stroke-width:2px
`;

export const toBeDiagram = `
graph LR
    A1[Odoo:<br/>Cotización] --> A2[Odoo:<br/>Orden]
    A2 --> A3[Odoo:<br/>Factura]
    A3 --> A4[DMS:<br/>Validación]
    A4 --> A5{Válido?}
    A5 -->|Sí| A6[DMS:<br/>Enriquece]
    A5 -->|No| A7[DMS:<br/>Alerta]
    A7 --> A3
    A6 --> A8[DMS→NAF:<br/>Sync]
    A8 --> A9[NAF:<br/>Automático]
    A9 --> A10[Dashboard]
    
    style A4 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A6 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A8 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A9 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style A5 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style A7 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
`;

// Compact horizontal purchase order flow with enhanced colors
export const purchaseOrderDiagram = `
graph LR
    subgraph KAM["👤 KAM"]
        A1[Oportunidad] --> A2[Cliente<br/>Aprueba]
    end
    
    subgraph ESP["👤 Especialista"]
        B1[Propuesta]
        B2[F-007<br/>APEX]
    end
    
    subgraph ADM["👤 Admin"]
        C1[Registro<br/>NAF]
        C2[Tiquete<br/>NAF]
    end
    
    subgraph GER["👤 Gerente"]
        D1{Margen<br/>< 10%?}
        D2[Aprueba]
    end
    
    subgraph BOD["📦 Bodega"]
        E1[Despacho]
    end
    
    A1 --> B1
    B1 --> A2
    A2 --> C1
    C1 --> B2
    B2 --> C2
    C2 --> D1
    D1 -->|Sí| D2
    D1 -->|No| E1
    D2 --> E1
    
    style KAM fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
    style ESP fill:#fff3e0,stroke:#FF9800,stroke-width:2px
    style ADM fill:#f3e5f5,stroke:#9C27B0,stroke-width:2px
    style GER fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px
    style BOD fill:#fce4ec,stroke:#E91E63,stroke-width:2px
    style D1 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style E1 fill:#90EE90,stroke:#228B22,stroke-width:2px
`;
