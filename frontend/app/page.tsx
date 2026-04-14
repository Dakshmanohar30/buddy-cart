"use client";

import { Navbar } from "@/components/buddy-cart/navbar";
import { Hero } from "@/components/buddy-cart/hero";
import { ProductCards } from "@/components/buddy-cart/product-cards";
import { RoleSelection } from "@/components/buddy-cart/role-selection";
import { Features } from "@/components/buddy-cart/features";
import { Integrations } from "@/components/buddy-cart/integrations";
import { CTA } from "@/components/buddy-cart/cta";
import { FloatingParticles } from "@/components/buddy-cart/floating-particles";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a1612] overflow-x-hidden">
      {/* Global floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingParticles />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Product Cards Section */}
      <ProductCards />

      {/* CTA Section */}
      <CTA />

      {/* Role Selection Section */}
      <RoleSelection />

      {/* Features Section */}
      <Features />

      {/* Integrations Section */}
      <Integrations />

      {/* Footer spacer */}
      <div className="h-20" />
    </main>
  );
}
