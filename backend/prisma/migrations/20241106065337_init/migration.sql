-- CreateTable
CREATE TABLE "solar_system" (
    "id" SERIAL NOT NULL,
    "lease_company" VARCHAR(50) NOT NULL,
    "lease_period" VARCHAR(50) NOT NULL,
    "module_output" DECIMAL(10,2) NOT NULL,
    "module_manufacturer" VARCHAR(50) NOT NULL,
    "module_model" VARCHAR(50) NOT NULL,
    "module_count" INTEGER NOT NULL,
    "pcs_manufacturer" VARCHAR(50) NOT NULL,
    "pcs_model" VARCHAR(50) NOT NULL,
    "pcs_count" INTEGER NOT NULL,
    "pcs_model2" VARCHAR(50),
    "pcs_count2" INTEGER,
    "module_pcs_cable_count" INTEGER NOT NULL,
    "bifurcated_count" INTEGER NOT NULL,
    "bracket_count" INTEGER NOT NULL,
    "total_module_output" DECIMAL(10,2) NOT NULL,
    "application_power_output" DECIMAL(10,2) NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "roof_material" VARCHAR(50) NOT NULL,
    "installation_points" VARCHAR(50) NOT NULL,
    "monthly_lease_fee_10" DECIMAL(10,0) NOT NULL,
    "monthly_lease_fee_15" DECIMAL(10,0),
    "total_leace_amount" DECIMAL(10,0) NOT NULL,
    "customer_group" VARCHAR(50) NOT NULL,
    "application_code" VARCHAR(50) NOT NULL,

    CONSTRAINT "solar_system_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batteries" (
    "id" SERIAL NOT NULL,
    "lease_company" VARCHAR(50) NOT NULL,
    "lease_period" VARCHAR(50) NOT NULL,
    "battery_manufacturer" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "capcity" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_capacity" DECIMAL(10,2) NOT NULL,
    "monthly_lease_fee" DECIMAL(10,0) NOT NULL,
    "total_leace_amount" DECIMAL(10,0) NOT NULL,
    "customer_group" VARCHAR(50) NOT NULL,
    "application_code" VARCHAR(50) NOT NULL,

    CONSTRAINT "batteries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "construction_costs" (
    "id" SERIAL NOT NULL,
    "lease_company" VARCHAR(50) NOT NULL,
    "payment_amount_to_dealer" DECIMAL(10,0) NOT NULL,
    "monthly_lease_fee" DECIMAL(10,0) NOT NULL,
    "total_leace_amount" DECIMAL(10,0) NOT NULL,
    "application_code" VARCHAR(50) NOT NULL,

    CONSTRAINT "construction_costs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "solar_system_application_code_key" ON "solar_system"("application_code");

-- CreateIndex
CREATE UNIQUE INDEX "batteries_application_code_key" ON "batteries"("application_code");

-- CreateIndex
CREATE UNIQUE INDEX "construction_costs_application_code_key" ON "construction_costs"("application_code");
