export const comparisonDiagram = `
graph LR
    subgraph ACTUAL["❌ Proceso actual"]
        direction LR
        A1["F-007<br/>Manual"] --> A2["Odoo<br/>Manual"]
        A2 --> A3["NAF<br/>Manual"]
        A3 --> A4{Errores?}
        A4 -->|Sí| A5[Reproceso]
        A5 --> A1
        A4 -->|No| A6[Panel]
    end
    
    subgraph PROPUESTO["✅ Proceso integrado"]
        direction LR
        B1["Odoo<br/>Cotización"] --> B2["Validación<br/>Automática"]
        B2 --> B3{Válido?}
        B3 -->|No| B4["Alerta<br/>Inmediata"]
        B4 --> B1
        B3 -->|Sí| B5["Sync<br/>NAF"]
        B5 --> B6[Panel]
    end
    
    style ACTUAL fill:#ffe6e6,stroke:#ff4444,stroke-width:2px
    style PROPUESTO fill:#e6ffe6,stroke:#44ff44,stroke-width:2px
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
        A["Odoo Web<br/>CRM / Preventa"]
    end
    
    subgraph PROMED["🏢 Sistemas Promed"]
        B["Odoo 18<br/>CRM + F-007 Digital"]
        C["Formulario F-007<br/>APEX (Actual)"]
        G["Flujo de Correos<br/>Manual"]
        D["NAF<br/>Procesos Comerciales"]
        E["NAF<br/>General Ledger"]
        F["WMS / Bodega"]
    end
    
    subgraph PARALELO["🧠 DMS (paralelo / opcional)"]
        X["Validaciones<br/>y Alertas"]
    end
    
    A --> B
    B --> D
    B --> G
    G --> D
    C -.-> D
    D --> E
    D --> F
    E --> F
    B -.-> X
    X -.-> D
    
    style B fill:#FFE7BA,stroke:#FFAA33,stroke-width:2px
    style C fill:#FFE4E1,stroke:#FF7F7F,stroke-width:2px
    style G fill:#FFFACD,stroke:#E6B800,stroke-width:2px
    style D fill:#ADD8E6,stroke:#4682B4,stroke-width:2px
    style E fill:#87CEFA,stroke:#1E90FF,stroke-width:3px
    style F fill:#E0E7FF,stroke:#7C83FD,stroke-width:2px
    style PARALELO fill:#F3E8FF,stroke:#B980FF
`;

export const flowDiagram = `
graph LR
    A1["Odoo:<br/>Cotización"] --> A2["Odoo:<br/>Orden Venta"]
    A2 --> A3["Odoo:<br/>Factura"]
    A3 --> A4["DMS:<br/>Validación"]
    A4 --> A5{Válido?}
    A5 -->|Sí| A6["DMS:<br/>Enriquecimiento"]
    A5 -->|No| A7["DMS:<br/>Alerta"]
    A7 --> A3
    A6 --> A8["DMS:<br/>Sync NAF"]
    A8 --> A9["NAF:<br/>Registro"]
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
    A[Factura] --> B{"Campos<br/>Críticos?"}
    B -->|OK| C{"Marca<br/>Única?"}
    B -->|Error| E1["❌ Alerta"]
    C -->|OK| D{"Comodato<br/>Válido?"}
    C -->|Error| E2["❌ Alerta"]
    D -->|OK| F{"Ganancia<br/>Correcta?"}
    D -->|Error| E3["❌ Alerta"]
    F -->|OK| G["✅ Sync NAF"]
    F -->|Error| E4["❌ Alerta"]
    
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
graph TD
    %% Flujo operativo manual
    subgraph MANUAL["❌ Flujo manual - Costos por etapa"]
        B1["F-007<br/>KAM / Especialista<br/>50 min · $8"] --> B2["Revisión Especialista<br/>30 min · $5"]
        B2 --> B3["Carga Odoo<br/>10 Admins<br/>40 min · $6"]
        B3 --> B4["Validación Facturación<br/>Sale Support<br/>25 min · $4"]
        B4 --> B5["Digitación NAF<br/>Admins<br/>35 min · $5"]
        B5 --> B6{"¿Errores / Faltantes?"}
        B6 -->|Sí · 31% casos| B7["Reproceso<br/>+65 min · +$10"]
        B7 --> B3
        B6 -->|No| B8["Reporte manual / Correos"]
    end

    %% Costos fijos mensuales
    subgraph COSTO["Carga mensual aproximada"]
        C1["14 KAM · $21k/mes"]
        C2["10 Admins · $15k/mes"]
        C3["Especialista · $1.5k/mes"]
        C4["Sale Support · $1.5k/mes"]
        C5["Usuarios Odoo activos: 222"]
    end

    B1 -.-> C1
    B2 -.-> C3
    B3 -.-> C2
    B4 -.-> C4
    B5 -.-> C2
    B7 -.-> C2

    classDef manual fill:#ff6b6b,stroke:#dc143c,stroke-width:2px,color:#fff;
    classDef decision fill:#ffd700,stroke:#ffa500,stroke-width:2px,color:#593400;
    classDef costo fill:#ffe4c4,stroke:#ff9c33,stroke-width:2px,color:#6b3a00;

    class B1,B2,B3,B4,B5,B7 manual;
    class B6 decision;
    class C1,C2,C3,C4,C5 costo;
`;

export const toBeDiagram = `
graph LR
    A1["Odoo:<br/>Cotización"] --> A2["Odoo:<br/>Orden"]
    A2 --> A3["Odoo:<br/>Factura"]
    A3 --> A4["DMS:<br/>Validación"]
    A4 --> A5{Válido?}
    A5 -->|Sí| A6["DMS:<br/>Enriquece"]
    A5 -->|No| A7["DMS:<br/>Alerta"]
    A7 --> A3
    A6 --> A8["DMS→NAF:<br/>Sync"]
    A8 --> A9["NAF:<br/>Automático"]
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
    %% Roles con costos
    subgraph KAM["👤 14 KAM · $21k/mes"]
        A1["Oportunidad<br/>25 min · $4"] --> A2["Cliente aprueba<br/>15 min · $2"]
    end

    subgraph ESP["👤 Especialista · $1.5k/mes"]
        B1["Propuesta técnica<br/>40 min · $6"]
        B2["F-007 APEX<br/>35 min · $5"]
    end

    subgraph ADM["👤 10 Administradores · $15k/mes"]
        C1["Registro NAF<br/>30 min · $5"]
        C2["Tiquete NAF<br/>45 min · $7"]
    end

    subgraph GER["👤 Gerente / Sale Support · $1.5k/mes"]
        D1{"Margen < 10%?<br/>15 min · $2"}
        D2["Aprobación<br/>10 min · $1.5"]
    end

    subgraph BOD["📦 Bodega / WMS"]
        E1["Despacho<br/>60 min · $10"]
    end

    %% Flujo principal
    A1 --> B1
    B1 --> A2
    A2 --> C1
    C1 --> B2
    B2 --> C2
    C2 --> D1
    D1 -->|Sí| D2
    D1 -->|No (pedido cancelado)| R1[Retrabajo + comunicación]
    R1 --> A1
    D2 --> E1

    %% Reproceso por errores de captura
    B2 -->|Campos faltantes (22%)| R2["Reproceso F-007<br/>+50 min · +$8"]
    R2 --> B2

    style KAM fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
    style ESP fill:#fff3e0,stroke:#FF9800,stroke-width:2px
    style ADM fill:#f3e5f5,stroke:#9C27B0,stroke-width:2px
    style GER fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px
    style BOD fill:#fce4ec,stroke:#E91E63,stroke-width:2px
    style D1 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style E1 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style R1,R2 fill:#ffcdd2,stroke:#e53935,stroke-width:2px
`;
