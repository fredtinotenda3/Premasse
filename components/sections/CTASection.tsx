import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gold-pale py-24 border-t border-gold/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Copy */}
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="font-display text-green-dark text-4xl md:text-5xl leading-tight mb-4">
              Ready to get compliant?
            </h2>
            <p className="font-body text-slate text-lg leading-relaxed">
              Submit a service request and one of our ZIMRA-registered practitioners
              will be in touch within one business day.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link
              href="/request"
              className="btn-gold text-green-dark font-body font-semibold px-8 py-4 rounded-sm text-base tracking-wide text-center"
            >
              Request a service
            </Link>
            <Link
              href="/contact"
              className="font-body text-green-dark border border-green-dark/25 hover:border-green-dark transition-colors duration-200 px-8 py-4 rounded-sm text-base tracking-wide text-center"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Divider stat strip */}
        <div className="mt-16 pt-12 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "14+",  label: "Services offered" },
            { value: "100%", label: "ZIMRA compliant" },
            { value: "1",    label: "Business day response" },
            { value: "Local", label: "Zimbabwe pricing" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-display text-3xl font-bold text-green-dark mb-1">
                {value}
              </div>
              <div className="font-body text-slate text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}