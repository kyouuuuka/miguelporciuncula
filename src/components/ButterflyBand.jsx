// Full-bleed butterfly band — butterfly.jpg fills the whole section.
export default function ButterflyBand() {
  return (
    <section data-nav="light" className="relative bg-ash">
      <img
        src="/butterfly.jpg"
        alt="A triptych of blurred butterfly studies in soft grayscale."
        width="1078"
        height="426"
        loading="lazy"
        className="block w-full"
      />
    </section>
  );
}
