export const architectureDiagram = `
graph TB
    subgraph "Capa de Presentación"
        A[Odoo Web Interface]
        B[Dashboard KBOX]
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
        N[KBOX Analytics]
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
    K --> N
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
        A9 --> A10[KBOX: Análisis de Datos]
        A10 --> A11[Dashboard: Reportes de Negocio]
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
