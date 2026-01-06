export const comparisonDiagram = `
graph LR
    subgraph ACTUAL["❌ Proceso actual"]
        direction LR
        CMP_A1["F-007<br/>Manual"] --> CMP_A2["Odoo<br/>Manual"]
        CMP_A2 --> CMP_A3["NAF<br/>Manual"]
        CMP_A3 --> CMP_A4{Errores?}
        CMP_A4 -->|Sí| CMP_A5[Reproceso]
        CMP_A5 --> CMP_A1
        CMP_A4 -->|No| CMP_A6[Panel]
    end
    
    subgraph PROPUESTO["✅ Proceso integrado"]
        direction LR
        CMP_B1["Odoo<br/>Cotización"] --> CMP_B2["Validación<br/>Automática"]
        CMP_B2 --> CMP_B3{Válido?}
        CMP_B3 -->|No| CMP_B4["Alerta<br/>Inmediata"]
        CMP_B4 --> CMP_B1
        CMP_B3 -->|Sí| CMP_B5["Sync<br/>NAF"]
        CMP_B5 --> CMP_B6[Panel]
    end
    
    style ACTUAL fill:#ffe6e6,stroke:#ff4444,stroke-width:2px
    style PROPUESTO fill:#e6ffe6,stroke:#44ff44,stroke-width:2px
    style CMP_A1 fill:#ffcccc,stroke:#ff6666
    style CMP_A2 fill:#ffcccc,stroke:#ff6666
    style CMP_A3 fill:#ffcccc,stroke:#ff6666
    style CMP_A5 fill:#ff9999,stroke:#ff4444
    style CMP_A4 fill:#FFD700,stroke:#FFA500
    style CMP_B2 fill:#90EE90,stroke:#228B22
    style CMP_B5 fill:#90EE90,stroke:#228B22
    style CMP_B3 fill:#FFD700,stroke:#FFA500
`;

export const architectureDiagram = `
graph LR
    subgraph UI["🖥️ Interfaz"]
        ARCH_A["Odoo Web<br/>CRM / Preventa"]
    end
    
    subgraph PROMED["🏢 Sistemas Promed"]
        ARCH_B["Odoo 18<br/>CRM + F-007 Digital"]
        ARCH_C["Formulario F-007<br/>APEX (Actual)"]
        ARCH_G["Flujo de Correos<br/>Manual"]
        ARCH_D["NAF<br/>Procesos Comerciales"]
        ARCH_E["NAF<br/>General Ledger"]
        ARCH_F["WMS / Bodega"]
    end
    
    subgraph PARALELO["🧠 DMS (paralelo / opcional)"]
        ARCH_X["Validaciones<br/>y Alertas"]
    end
    
    ARCH_A --> ARCH_B
    ARCH_B --> ARCH_D
    ARCH_B --> ARCH_G
    ARCH_G --> ARCH_D
    ARCH_C -.-> ARCH_D
    ARCH_D --> ARCH_E
    ARCH_D --> ARCH_F
    ARCH_E --> ARCH_F
    ARCH_B -.-> ARCH_X
    ARCH_X -.-> ARCH_D
    
    style ARCH_B fill:#FFE7BA,stroke:#FFAA33,stroke-width:2px
    style ARCH_C fill:#FFE4E1,stroke:#FF7F7F,stroke-width:2px
    style ARCH_G fill:#FFFACD,stroke:#E6B800,stroke-width:2px
    style ARCH_D fill:#ADD8E6,stroke:#4682B4,stroke-width:2px
    style ARCH_E fill:#87CEFA,stroke:#1E90FF,stroke-width:3px
    style ARCH_F fill:#E0E7FF,stroke:#7C83FD,stroke-width:2px
    style PARALELO fill:#F3E8FF,stroke:#B980FF
`;

export const flowDiagram = `
graph LR
    FLOW_A1["Odoo:<br/>Cotización"] --> FLOW_A2["Odoo:<br/>Orden Venta"]
    FLOW_A2 --> FLOW_A3["Odoo:<br/>Factura"]
    FLOW_A3 --> FLOW_A4["DMS:<br/>Validación"]
    FLOW_A4 --> FLOW_A5{Válido?}
    FLOW_A5 -->|Sí| FLOW_A6["DMS:<br/>Enriquecimiento"]
    FLOW_A5 -->|No| FLOW_A7["DMS:<br/>Alerta"]
    FLOW_A7 --> FLOW_A3
    FLOW_A6 --> FLOW_A8["DMS:<br/>Sync NAF"]
    FLOW_A8 --> FLOW_A9["NAF:<br/>Registro"]
    FLOW_A9 --> FLOW_A10[Dashboard]
    
    style FLOW_A4 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style FLOW_A5 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style FLOW_A6 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style FLOW_A8 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style FLOW_A9 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style FLOW_A7 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
`;

export const businessRulesDiagram = `
graph LR
    BR_A[Factura] --> BR_B{"Campos<br/>Críticos?"}
    BR_B -->|OK| BR_C{"Marca<br/>Única?"}
    BR_B -->|Error| BR_E1["❌ Alerta"]
    BR_C -->|OK| BR_D{"Comodato<br/>Válido?"}
    BR_C -->|Error| BR_E2["❌ Alerta"]
    BR_D -->|OK| BR_F{"Ganancia<br/>Correcta?"}
    BR_D -->|Error| BR_E3["❌ Alerta"]
    BR_F -->|OK| BR_G["✅ Sync NAF"]
    BR_F -->|Error| BR_E4["❌ Alerta"]
    
    BR_E1 --> BR_A
    BR_E2 --> BR_A
    BR_E3 --> BR_A
    BR_E4 --> BR_A
    
    style BR_B fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BR_C fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BR_D fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BR_F fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style BR_G fill:#90EE90,stroke:#228B22,stroke-width:3px
    style BR_E1 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style BR_E2 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style BR_E3 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
    style BR_E4 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
`;

export const asIsDiagram = `
graph TD
    %% Flujo operativo manual
    subgraph MANUAL["❌ Flujo manual - Costos por etapa"]
        AI_B1["F-007<br/>KAM / Especialista<br/>50 min · $8"] --> AI_B2["Revisión Especialista<br/>30 min · $5"]
        AI_B2 --> AI_B3["Carga Odoo<br/>10 Admins<br/>40 min · $6"]
        AI_B3 --> AI_B4["Validación Facturación<br/>Sale Support<br/>25 min · $4"]
        AI_B4 --> AI_B5["Digitación NAF<br/>Admins<br/>35 min · $5"]
        AI_B5 --> AI_B6{"¿Errores / Faltantes?"}
        AI_B6 -->|Sí · 31% casos| AI_B7["Reproceso<br/>+65 min · +$10"]
        AI_B7 --> AI_B3
        AI_B6 -->|No| AI_B8["Reporte manual / Correos"]
    end

    %% Costos fijos mensuales
    subgraph COSTO["Carga mensual aproximada"]
        AI_C1["14 KAM · $21k/mes"]
        AI_C2["10 Admins · $15k/mes"]
        AI_C3["Especialista · $1.5k/mes"]
        AI_C4["Sale Support · $1.5k/mes"]
        AI_C5["Usuarios Odoo activos: 222"]
    end

    AI_B1 -.-> AI_C1
    AI_B2 -.-> AI_C3
    AI_B3 -.-> AI_C2
    AI_B4 -.-> AI_C4
    AI_B5 -.-> AI_C2
    AI_B7 -.-> AI_C2

    classDef manual fill:#ff6b6b,stroke:#dc143c,stroke-width:2px,color:#fff;
    classDef decision fill:#ffd700,stroke:#ffa500,stroke-width:2px,color:#593400;
    classDef costo fill:#ffe4c4,stroke:#ff9c33,stroke-width:2px,color:#6b3a00;

    class AI_B1,AI_B2,AI_B3,AI_B4,AI_B5,AI_B7 manual;
    class AI_B6 decision;
    class AI_C1,AI_C2,AI_C3,AI_C4,AI_C5 costo;
`;

export const toBeDiagram = `
graph LR
    TB_A1["Odoo:<br/>Cotización"] --> TB_A2["Odoo:<br/>Orden"]
    TB_A2 --> TB_A3["Odoo:<br/>Factura"]
    TB_A3 --> TB_A4["DMS:<br/>Validación"]
    TB_A4 --> TB_A5{Válido?}
    TB_A5 -->|Sí| TB_A6["DMS:<br/>Enriquece"]
    TB_A5 -->|No| TB_A7["DMS:<br/>Alerta"]
    TB_A7 --> TB_A3
    TB_A6 --> TB_A8["DMS→NAF:<br/>Sync"]
    TB_A8 --> TB_A9["NAF:<br/>Automático"]
    TB_A9 --> TB_A10[Dashboard]
    
    style TB_A4 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style TB_A6 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style TB_A8 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style TB_A9 fill:#90EE90,stroke:#228B22,stroke-width:2px
    style TB_A5 fill:#FFD700,stroke:#FFA500,stroke-width:2px
    style TB_A7 fill:#FF6B6B,stroke:#DC143C,stroke-width:2px
`;

// Compact horizontal purchase order flow with enhanced colors
export const purchaseOrderDiagram = `
flowchart LR
    PO_K1["KAM · Oportunidad<br/>25 min · $4"] --> PO_E1["Especialista · Propuesta técnica<br/>40 min · $6"]
    PO_E1 --> PO_K2["CAM · Cliente aprueba<br/>15 min · $2"]
    PO_K2 --> PO_A1["Admins · Registro NAF<br/>30 min · $5"]
    PO_A1 --> PO_E2["Especialista · F-007 APEX<br/>35 min · $5"]
    PO_E2 --> PO_A2["Admins · Tiquete NAF<br/>45 min · $7"]
    PO_A2 --> PO_G1{"Gerencia · Margen < 10%?<br/>15 min · $2"}
    PO_G1 -->|Sí| PO_G2["Gerencia · Aprobación<br/>10 min · $1.5"]
    PO_G1 -->|No| PO_R1["Retrabajo + comunicación"]
    PO_G2 --> PO_B1["Bodega · Despacho<br/>60 min · $10"]
    PO_R1 --> PO_K1
    PO_E2 -->|Campos faltantes (22%)| PO_R2["Reproceso F-007<br/>+50 min · +$8"]
    PO_R2 --> PO_E2

    classDef kam fill:#e3f2fd,stroke:#2196F3,stroke-width:2px,color:#0f172a;
    classDef esp fill:#fff3e0,stroke:#FF9800,stroke-width:2px,color:#7c2d12;
    classDef adm fill:#f3e5f5,stroke:#9C27B0,stroke-width:2px,color:#4a044e;
    classDef ger fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px,color:#064e3b;
    classDef bod fill:#fce4ec,stroke:#E91E63,stroke-width:2px,color:#831843;
    classDef warn fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f;
    classDef error fill:#ffcdd2,stroke:#e53935,stroke-width:2px,color:#7f1d1d;
    class PO_K1,PO_K2 kam;
    class PO_E1,PO_E2 esp;
    class PO_A1,PO_A2 adm;
    class PO_G1 warn;
    class PO_G2 ger;
    class PO_B1 bod;
    class PO_R1,PO_R2 error;
`;

export const procedureOverviewDiagram = `
flowchart LR
    PROC_A["4.1 Identificación<br/>Cliente + CAM"] --> PROC_B{"¿Información completa?"}
    PROC_B -->|Sí| PROC_C["4.2 Cotización Odoo<br/>Especialista / Sales Support"]
    PROC_B -->|No| PROC_A
    PROC_C --> PROC_D["4.3 Presentación y negociación<br/>CAM + Cliente"]
    PROC_D --> PROC_E{"4.4 Cliente aprueba?"}
    PROC_E -->|No| PROC_C
    PROC_E -->|Sí| PROC_F["4.5 F-007 replicado<br/>CAM / Especialista / Support"]
    PROC_F --> PROC_G["4.6 Validaciones admin<br/>Requisiciones + notas"]
    PROC_G --> PROC_H["4.7 Factura emitida"]
    classDef step fill:#ecfccb,stroke:#65a30d,color:#1c1917,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
    class PROC_A,PROC_C,PROC_D,PROC_F,PROC_G,PROC_H step;
    class PROC_B,PROC_E decision;
`;

export const validationChecklistDiagram = `
flowchart TD
    CHK_A["Recibir F-007 validado"] --> CHK_B{"¿Componentes o kits?"}
    CHK_B -->|Sí| CHK_C["Generar y cerrar requisiciones antes de facturar"]
    CHK_B -->|No| CHK_D{"¿Notas de entrega previas?"}
    CHK_C --> CHK_D
    CHK_D -->|Sí| CHK_E["Enlazar notas y documentar causa"]
    CHK_D -->|No| CHK_F["Sin notas pendientes"]
    CHK_E --> CHK_F
    CHK_F --> CHK_G["Verificar descuentos autorizados"]
    CHK_G --> CHK_H["Factura lista para emitir"]
    classDef action fill:#e0f2fe,stroke:#0ea5e9,color:#0f172a,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
    class CHK_A,CHK_C,CHK_E,CHK_F,CHK_G,CHK_H action;
    class CHK_B,CHK_D decision;
`;

export const summaryChainDiagram = `
flowchart LR
    SUM_A["Cliente"] --> SUM_B["CAM"]
    SUM_B --> SUM_C["Especialista"]
    SUM_C --> SUM_D["Odoo Cotización"]
    SUM_D --> SUM_E["CAM presenta"]
    SUM_E --> SUM_F["Cliente aprueba / OC"]
    SUM_F --> SUM_G["F-007"]
    SUM_G --> SUM_H["Administrador"]
    SUM_H --> SUM_I["Factura"]
    SUM_F -->|Cambios solicitados| SUM_C
    classDef actor fill:#ede9fe,stroke:#7c3aed,color:#1e1b4b,stroke-width:2px;
    classDef system fill:#cffafe,stroke:#0891b2,color:#0f172a,stroke-width:2px;
    class SUM_A,SUM_B,SUM_C,SUM_E,SUM_F,SUM_H,SUM_I actor;
    class SUM_D,SUM_G system;
`;
