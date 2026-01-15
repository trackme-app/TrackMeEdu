import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TME API Documentation',
            version: '1.0.0',
            description: 'API documentation for the TME API Gateway',
        },
        servers: [
            {
                url: 'http://<instance>.tme.track-me.app',
                description: 'Local development server',
            },
            {
                url: '{protocol}://{host}:{port}',
                description: 'Custom Server',
                variables: {
                    protocol: {
                        enum: ['http', 'https'],
                        default: 'https',
                    },
                    host: {
                        default: '<instance>.tme.track-me.app',
                    },
                    port: {
                        default: '443',
                    },
                },
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                tenantId: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-Tenant-Id',
                },
            },
            schemas: {
                Course: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        tenantId: { type: 'string' },
                        course_name: { type: 'string' },
                        description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['course_name'],
                },
                ColourScheme: {
                    type: 'object',
                    properties: {
                        background_lightmode: { type: 'string', nullable: true },
                        foreground_lightmode: { type: 'string', nullable: true },
                        alt_lightmode: { type: 'string', nullable: true },
                        nav_lightmode: { type: 'string', nullable: true },
                        border_lightmode: { type: 'string', nullable: true },
                        background_darkmode: { type: 'string', nullable: true },
                        foreground_darkmode: { type: 'string', nullable: true },
                        alt_darkmode: { type: 'string', nullable: true },
                        nav_darkmode: { type: 'string', nullable: true },
                        border_darkmode: { type: 'string', nullable: true },
                        button_color_pos_lightmode: { type: 'string', nullable: true },
                        button_color_pos_darkmode: { type: 'string', nullable: true },
                        button_color_neg_lightmode: { type: 'string', nullable: true },
                        button_color_neg_darkmode: { type: 'string', nullable: true },
                    },
                },
                TenantSettings: {
                    type: 'object',
                    properties: {
                        data_residency_region: { type: 'string' },
                        encryption_required: { type: 'boolean' },
                        mfa_required: { type: 'boolean' },
                        audit_retention_days: { type: 'integer' },
                        data_retention_days: { type: 'integer' },
                        ip_whitelist_enabled: { type: 'boolean' },
                        ip_whitelist: { type: 'array', items: { type: 'string' } },
                        colour_scheme: { $ref: '#/components/schemas/ColourScheme' },
                    },
                },
                Tenant: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        tenant_name: { type: 'string' },
                        tenant_plan: { type: 'string' },
                        tenant_status: { type: 'string' },
                        company_name: { type: 'string' },
                        primary_owner_email: { type: 'string', format: 'email' },
                        billing_contact_email: { type: 'string', format: 'email' },
                        tenant_settings: { $ref: '#/components/schemas/TenantSettings' },
                        tenant_description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['tenant_name', 'company_name', 'primary_owner_email'],
                },
                UserSettings: {
                    type: 'object',
                    properties: {
                        language: { type: 'string' },
                        timezone: { type: 'string' },
                        profilePictureUrl: { type: 'string' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        tenantId: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        emailAddress: { type: 'string', format: 'email' },
                        status: { type: 'string', enum: ['pending', 'active', 'disabled', 'deleted'] },
                        settings: { $ref: '#/components/schemas/UserSettings' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['firstName', 'lastName', 'emailAddress'],
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './dist/routes/*.js'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
