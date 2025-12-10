import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import dotenv from "dotenv";
import { 
  metricDefinitions, businessProcesses, impactEstimates,
  InsertMetricDefinition, InsertBusinessProcess, InsertImpactEstimate 
} from "../drizzle/schema";

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const db = drizzle(client);

async function seed() {
  console.log("Seeding ROI definitions and processes...");

  // 1. Metric Definitions (Variables)
  const metrics: InsertMetricDefinition[] = [
    // Costs
    { id: "cost_license_annual", name: "Licensing & Subscription", category: "financial_cost", unit: "USD", description: "Annual cost for NetSuite licenses (OneWorld + Users)." },
    { id: "cost_implementation", name: "Implementation Services", category: "financial_cost", unit: "USD", description: "One-time cost for partner implementation, config, and dev." },
    { id: "cost_training", name: "Training & Change Mgmt", category: "financial_cost", unit: "USD", description: "Training sessions, documentation, and adoption programs." },
    { id: "cost_data_migration", name: "Data Migration", category: "financial_cost", unit: "USD", description: "Cleaning and moving 5 years of history from NAF." },
    { id: "cost_support_annual", name: "Ongoing Support", category: "financial_cost", unit: "USD", description: "Post-go-live support contract and internal admin." },
    
    // Benefits
    { id: "benefit_efficiency", name: "Operational Efficiency", category: "financial_benefit", unit: "percent", description: "Expected % increase in productivity (process automation)." },
    { id: "benefit_it_savings", name: "IT Maintenance Savings", category: "financial_benefit", unit: "USD", description: "Savings from retiring on-prem servers and NAF maintenance." },
    { id: "benefit_compliance", name: "Compliance Risk Reduction", category: "risk_factor", unit: "score", description: "Reduced risk of fines/penalties (Score 1-10)." },
    { id: "benefit_scalability", name: "Scalability Potential", category: "operational_kpi", unit: "score", description: "Ability to support new markets/products (Score 1-10)." },
    
    // Process Metrics
    { id: "metric_time_invoice", name: "Time to Process Invoice", category: "operational_kpi", unit: "hours", description: "Average time to process a supplier invoice." },
    { id: "metric_close_days", name: "Days to Close Books", category: "operational_kpi", unit: "days", description: "Number of days to finalize monthly financial close." },
    { id: "metric_stock_accuracy", name: "Inventory Accuracy", category: "operational_kpi", unit: "percent", description: "Accuracy of stock records vs physical count." },
  ];

  for (const m of metrics) {
    await db.insert(metricDefinitions).values(m).onConflictDoUpdate({ target: metricDefinitions.id, set: m }).run();
  }

  // 2. Business Processes
  const processes: InsertBusinessProcess[] = [
    { id: "finance_ap", name: "Accounts Payable", department: "Finance", criticality: "high", description: "Invoice receipt, validation, approval, and payment." },
    { id: "finance_close", name: "Financial Close", department: "Finance", criticality: "critical", description: "Monthly consolidation and reporting." },
    { id: "inventory_mgmt", name: "Inventory Management", department: "Operations", criticality: "critical", description: "Tracking movements, lots, expiration, and counts." },
    { id: "sales_order", name: "Order Processing", department: "Sales", criticality: "high", description: "Order entry, credit check, fulfillment." },
    { id: "regulatory", name: "Regulatory Compliance", department: "Regulatory", criticality: "critical", description: "Medical device traceability and reporting." },
    { id: "technical_service", name: "Technical Service", department: "Service", criticality: "medium", description: "Maintenance scheduling and ticketing." },
  ];

  for (const p of processes) {
    await db.insert(businessProcesses).values(p).onConflictDoUpdate({ target: businessProcesses.id, set: p }).run();
  }

  // 3. Impact Estimates (Initial Deep Dive Data)
  const estimates: InsertImpactEstimate[] = [
    // Costs Estimates (from docs)
    { 
      id: "est_license_2026", 
      metricId: "cost_license_annual", 
      amount: 60000, amountMin: 30000, amountMax: 100000, 
      confidence: "medium", 
      assumptions: "Based on mid-market pricing for ~60 full users + self-service.",
      source: "Market Research / Kimberlite"
    },
    { 
      id: "est_impl_2026", 
      metricId: "cost_implementation", 
      amount: 150000, amountMin: 100000, amountMax: 250000, 
      confidence: "medium", 
      assumptions: "6-12 month project, complex data migration.",
      source: "Industry Averages"
    },
    
    // Process Improvements (Hypothesis from docs)
    {
      id: "est_close_days_curr",
      metricId: "metric_close_days",
      processId: "finance_close",
      amount: 15,
      confidence: "medium",
      assumptions: "Current manual consolidation takes ~2-3 weeks.",
      source: "Internal Interview",
      followUpRequired: true
    },
    {
      id: "est_close_days_target",
      metricId: "metric_close_days",
      processId: "finance_close",
      amount: 5,
      confidence: "medium",
      assumptions: "Target with NetSuite automation.",
      source: "NetSuite Benchmarks"
    }
  ];

  for (const e of estimates) {
    await db.insert(impactEstimates).values(e).onConflictDoUpdate({ target: impactEstimates.id, set: e }).run();
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
