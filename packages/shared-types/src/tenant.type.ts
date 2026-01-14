import { TenantSettings } from "./tenantSettings.type";

export interface Tenant {
    id?: string;
    tenant_name: string;
    tenant_plan: string;
    tenant_status: string; // provisioning, active, suspended, deleted
    company_name: string;
    primary_owner_email: string;
    billing_contact_email: string;
    tenant_settings: TenantSettings;
    tenant_description?: string;
    createdAt?: string;
    modifiedAt?: string;
    deletedAt?: string;
    suspendedReason?: string;
    deletedReason?: string;
}