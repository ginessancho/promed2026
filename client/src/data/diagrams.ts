export const architectureDiagram = `
graph TB
    subgraph "Capa de Presentación"
        A[Odoo Web Interface]
        B[Dashboard Analytics]
        C[CRM Interface]
    end
    
    subgraph "Capa de Aplicación - Odoo"
        D[Odoo Accounting Module]
        E[Odoo Sales Module]
        F[Custom Integration Module]
        G[API Gateway]
    end
    
    subgraph "Capa de Integración - Middleware"
        H[Data Mapper]
        I[Business Rules Engine]
        J[Validation Layer]
        K[Queue Manager]
        L[Error Handler]
    end
    
    subgraph "Sistemas Externos"
        M[NAF/Oracle]
        N[Analytics Dashboard]
        O[CRM System]
    end
    
    subgraph "Capa de Datos"
        P[(PostgreSQL - Odoo)]
        Q[(Oracle - NAF)]
        R[(Redshift - Analytics)]
    end
    
    A --> D
    A --> E
    D --> F
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> M

    K --> O
    K --> L
    L --> M
    D --> P
    M --> Q
    N --> R
    
    style F fill:#ffd700
    style I fill:#ffd700
    style J fill:#ffd700
    style K fill:#ffd700
`;

export const flowDiagram = `
graph LR
    subgraph "FLUJO PROPUESTO (TO-BE)"
        A1[Odoo: Creación de Cotización] --> A2[Odoo: Conversión a Orden de Venta]
        A2 --> A3[Odoo: Generación de Factura]
        A3 --> A4[DMS: Validación de Reglas de Negocio]
        A4 --> A5{¿Datos Válidos?}
        A5 -->|Sí| A6[DMS: Enriquecimiento de Datos]
        A5 -->|No| A7[DMS: Notificación de Errores]
        A7 --> A3
        A6 --> A8[DMS: Sincronización con NAF]
        A8 --> A9[NAF: Registro de Factura]
        A9 --> A10[Dashboard: Reportes de Negocio]
    end
    
    style A4 fill:#90EE90
    style A5 fill:#FFD700
    style A6 fill:#90EE90
    style A8 fill:#90EE90
`;

export const businessRulesDiagram = `
graph TD
    A[Factura en Odoo] --> B{Validación de Campos Críticos}
    B -->|no_arti existe| C{¿Marca asignada?}
    C -->|Sí| D{¿Marca única para artículo?}
    C -->|No| E[Error: Marca requerida]
    D -->|Sí| F{¿ind_comodato = S?}
    D -->|No| G[Error: Múltiples marcas detectadas]
    F -->|Sí| H{¿no_comodato existe?}
    F -->|No| I{¿no_comodato vacío?}
    H -->|Sí| J[Validación OK]
    H -->|No| K[Error: Número de comodato requerido]
    I -->|Sí| J
    I -->|No| L[Error: Comodato sin indicador]
    J --> M{¿Cálculo de ganancia correcto?}
    M -->|Sí| N[Sincronizar con NAF]
    M -->|No| O[Error: Recalcular ganancia]
    
    style B fill:#FFD700
    style D fill:#FFD700
    style F fill:#FFD700
    style M fill:#FFD700
    style N fill:#90EE90
    style E fill:#FF6B6B
    style G fill:#FF6B6B
    style K fill:#FF6B6B
    style L fill:#FF6B6B
    style O fill:#FF6B6B
`;


export const asIsDiagram = `
graph LR
    subgraph "FLUJO ACTUAL (AS-IS)"
        B1[F-007: Entrada Manual de Datos] --> B2[Especialista: Revisión]
        B2 --> B3[Odoo: Entrada Manual Duplicada]
        B3 --> B4[Equipo Facturación: Revisión en Odoo]
        B4 --> B5[NAF: Entrada Manual Triplicada]
        B5 --> B6{¿Errores Detectados?}
        B6 -->|Sí| B7[Reproceso Manual]
        B7 --> B3
        B6 -->|No| B8[Dashboard: Reportes de Negocio]
    
    style B1 fill:#FF6B6B
    style B3 fill:#FF6B6B
    style B5 fill:#FF6B6B
    style B7 fill:#FF6B6B
`;

export const toBeDiagram = `
graph LR
    subgraph "FLUJO PROPUESTO (TO-BE)"
        A1[Odoo: Creación de Cotización] --> A2[Odoo: Conversión a Orden]
        A2 --> A3[Odoo: Generación de Factura]
        A3 --> A4[DMS: Validación Automática]
        A4 --> A5{¿Datos Válidos?}
        A5 -->|Sí| A6[DMS: Enriquecimiento]
        A5 -->|No| A7[DMS: Alerta Inmediata]
        A7 --> A3
        A6 --> A8[DMS → NAF: Sincronización]
        A8 --> A9[NAF: Registro Automático]
        A9 --> A10[Dashboard: Reportes de Negocio]
    end
    
    style A4 fill:#90EE90
    style A6 fill:#90EE90
    style A8 fill:#90EE90
    style A9 fill:#90EE90
`;

export const purchaseOrderDiagram = `
graph TB
    subgraph KAM["👤 KAM / Inside Sale"]
        A1[Genera oportunidad<br/>de venta]
        A2[Cliente aprueba y<br/>genera orden de compra]
    end
    
    subgraph ESP["👤 Especialista de Producto"]
        B1[Confecciona<br/>propuesta]
        B2[Recibe notificación<br/>de registro]
        B3{Mercancía<br/>disponible?}
        B4[Gestiona pre-pedido<br/>y cumple flujo]
        B5[Completa F-007<br/>en APEX]
    end
    
    subgraph ADM["👤 Administrador Servicio al Cliente"]
        C1[Registra orden<br/>en NAF]
        C2[Confecciona tiquete<br/>en NAF]
        C3[Ingresa a NAF y<br/>coloca 'aprobación']
    end
    
    subgraph GER["👤 Gerente de Ventas"]
        D1{Margen<br/>< 10%?}
        D2[Revisa tiquete<br/>generado]
        D3{Aprueba<br/>margen?}
        D4[Comunica decisión<br/>y motivo]
        D5[Aprueba tiquete<br/>en NAF]
    end
    
    subgraph BOD["👤 Bodega"]
        E1[Selección, empaque<br/>y despacho]
    end
    
    subgraph SYS["🖥️ Sistemas"]
        S1[NAF envía<br/>alerta]
        S2[NAF genera<br/>tarea en WMS]
    end
    
    A1 --> B1
    B1 --> A2
    A2 --> C1
    C1 --> B2
    B2 --> B3
    B3 -->|No| B4
    B3 -->|Sí| B5
    B5 --> C2
    C2 --> D1
    D1 -->|Sí| S1
    S1 --> D2
    D2 --> D3
    D3 -->|No| D4
    D4 --> FIN1[Fin]
    D3 -->|Sí| D5
    D5 --> C3
    D1 -->|No| C3
    C3 --> S2
    S2 --> E1
    E1 --> FIN2[Fin]
    
    style KAM fill:#e3f2fd
    style ESP fill:#fff3e0
    style ADM fill:#f3e5f5
    style GER fill:#e8f5e9
    style BOD fill:#fce4ec
    style SYS fill:#f5f5f5
    style FIN1 fill:#ffebee
    style FIN2 fill:#e8f5e9
`;
