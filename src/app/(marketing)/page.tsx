import { MarketingHeader } from "@/components/marketing/marketing-header";
import { HeroSection } from "@/components/marketing/hero-section";
import { ProductSection } from "@/components/marketing/product-section";
import { MarketsSection } from "@/components/marketing/markets-section";
import { ComplianceSection } from "@/components/marketing/compliance-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { SystemPreviewSection } from "@/components/marketing/system-preview-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
            <MarketingHeader />
            <main className="flex-grow">
                <HeroSection />
                <ProductSection />
                <MarketsSection />
                <ComplianceSection />
                <HowItWorksSection />
                <SystemPreviewSection />
            </main>
            <MarketingFooter />
        </div>
    );
}
