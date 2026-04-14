const reasons = [
  {
    number: "01",
    title: "Registered practitioners",
    body: "All our accountants are registered with the Public Accountants and Auditors Board (PAAB) of Zimbabwe.",
  },
  {
    number: "02",
    title: "ZIMRA specialists",
    body: "Deep familiarity with Zimbabwe's tax legislation, ZIMRA processes, and regulatory requirements means fewer delays.",
  },
  {
    number: "03",
    title: "SME-focused pricing",
    body: "We structure our fees around the realities of small and growing businesses — no hidden costs, no surprises.",
  },
  {
    number: "04",
    title: "End-to-end handling",
    body: "We don't just advise — we prepare, submit, and follow up on your behalf until the job is done.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-navy py-28" id="why-us">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* Header */}
        <div className="mb-16 max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
              Why Premasse
            </span>
          </div>
          <h2 className="font-display text-white text-4xl md:text-5xl leading-tight">
            The firm that{" "}
            <em className="text-gold">gets things done.</em>
          </h2>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          {reasons.map((r) => (
            <div
              key={r.number}
              className="bg-navy p-10 hover:bg-navy-light transition-colors duration-300 group"
            >
              <span className="font-display text-5xl text-gold/20 group-hover:text-gold/30 transition-colors duration-300 block mb-6 leading-none">
                {r.number}
              </span>
              <h3 className="font-display text-white text-xl font-semibold mb-3">
                {r.title}
              </h3>
              <p className="font-body text-white/55 text-sm leading-relaxed">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
