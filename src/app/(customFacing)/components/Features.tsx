import type { ElementType } from "react";
import { DollarSign, Truck, ThumbsUp, Lock } from "lucide-react";

const FeatureCard = ({ icon: Icon, title }: { icon: ElementType; title: string }) => (
  <div className="relative group md:h-[230px] opacity-100 translate-y-0 transition-all duration-500 ease-out">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all border opacity-0 group-hover:opacity-70" />
    <div className="relative bg-background/50 backdrop-blur-lg border border-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 transition-all group-hover:translate-y-[-2px] h-full">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg" />
        <div className="relative bg-background border border-primary/10 h-20 w-20 rounded-full flex items-center justify-center">
          <Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg  text-primary">{title}</h3>
    </div>
  </div>
);

export default function Features() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 " />
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={DollarSign} title="GWARANCJA ZWROTU PIENIĘDZY" />
          <FeatureCard icon={Truck} title="DARMOWA DOSTAWA" />
          <FeatureCard icon={ThumbsUp} title="GWARANCJA SATYSFAKCJI" />
          <FeatureCard icon={Lock} title="BEZPIECZNE PŁATNOŚCI" />
        </div>
      </div>
    </section>
  );
}
