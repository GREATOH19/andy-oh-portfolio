import Image from "next/image";
import type {ReactNode} from "react";

/**
 * Monklap project page — the portfolio slides rebuilt as responsive web sections.
 * Assets live in /public/monklap.
 */

const INK = "text-[#101a2e]";
const BROWN = "text-[#7a4a2b]";
const SECTION = "mx-auto w-full max-w-[1200px] px-6 py-16 sm:px-10 md:py-24";

const asset = (name: string) => `/monklap/${name}`;

function Eyebrow({children, className = ""}: {children: ReactNode; className?: string}) {
  return (
    <p className={`font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[#4a5a6e] sm:text-xs ${className}`}>
      {children}
    </p>
  );
}

function Headline({
  dark,
  accent,
  className = "",
}: {
  dark: string;
  accent?: string;
  className?: string;
}) {
  return (
    <h2
      className={`font-sans text-5xl font-extrabold leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-7xl ${className}`}
    >
      <span className={INK}>{dark}</span>
      {accent ? (
        <>
          {" "}
          <span className={BROWN}>{accent}</span>
        </>
      ) : null}
    </h2>
  );
}

function Caption({children}: {children: ReactNode}) {
  return (
    <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#4a5a6e]">
      {children}
    </p>
  );
}

function Num({children, className = ""}: {children: ReactNode; className?: string}) {
  return <span className={`font-mono text-xs text-[#1d6fa5] ${className}`}>{children}</span>;
}

/** The OLED eyes shown on the slide cover. */
function EyesPill() {
  const pixels = [
    [0, 3], [1, 2], [2, 1], [3, 2], [4, 3],
  ];
  const eye = (x0: number) =>
    pixels.map(([x, y]) => (
      <rect key={`${x0}-${x}`} x={x0 + x * 6} y={y * 6} width="5" height="5" fill="#6db7ee" />
    ));
  return (
    <svg
      viewBox="0 0 106 40"
      className="h-12 w-auto rounded-full border-[3px] border-[#7a4a2b] bg-[#0b1426] p-2.5 sm:h-14"
      role="img"
      aria-label="Monklap pixel eyes"
    >
      <g transform="translate(2,6)">{eye(0)}</g>
      <g transform="translate(54,6)">{eye(0)}</g>
    </svg>
  );
}

function Cover() {
  return (
    <section className={`${SECTION} grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]`}>
      <div>
        <Eyebrow>Portfolio · Industrial Design 2026</Eyebrow>
        <div className="mt-10">
          <EyesPill />
        </div>
        <h1
          className={`mt-6 font-sans text-[4.5rem] font-extrabold leading-[0.9] tracking-[-0.06em] sm:text-[7rem] md:text-[8.5rem] ${INK}`}
        >
          Monklap
        </h1>
        <p className={`mt-6 max-w-md text-2xl leading-snug sm:text-3xl ${INK}`}>
          A touchless ambient scent system that answers a clap.
        </p>
        <dl className="mt-12 grid grid-cols-1 gap-6 border-t border-[#7a4a2b] pt-6 sm:grid-cols-3">
          {[
            ["Type", "Wall-mounted / desktop IoT object"],
            ["Tools", "Rhino 8 · Bambu Studio · ESP32"],
            ["Designer", "Andy Oh"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#4a5a6e]">{k}</dt>
              <dd className={`mt-2 text-base leading-snug ${INK}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Image
        src={asset("render-front.webp")}
        alt="Monklap rendering"
        width={1509}
        height={1600}
        priority
        sizes="(min-width: 768px) 45vw, 90vw"
        className="mx-auto h-auto w-full max-w-[34rem] rounded-3xl"
      />
    </section>
  );
}

function Overview() {
  const pillars = [
    ["01", "Touchless", "Sound and proximity replace the spray trigger, for moments when your hands are busy, wet or full."],
    ["02", "Interactive", "An OLED face gives it a character and shows visible feedback for every state."],
    ["03", "Ambient", "A wick-fed ultrasonic atomizer releases a 1.5-second burst of mist on demand, not a constant stream."],
  ];
  return (
    <section className={`${SECTION} grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center`}>
      <div>
        <Eyebrow>02 — Overview</Eyebrow>
        <Headline dark="Scent," accent="on cue" className="mt-8" />
        <p className={`mt-8 max-w-xl text-xl leading-relaxed sm:text-2xl ${INK}`}>
          <strong>Monklap</strong> is a <strong>wall-mounted or desktop</strong> diffuser shaped like a friendly
          monkey. Walk up and clap, and it responds with a pulse of fragrant mist from its mouth.{" "}
          <strong>No buttons, no app, nothing to touch.</strong>
        </p>
        <div className="mt-12 grid gap-8 border-t border-[#7a4a2b] pt-8 sm:grid-cols-3">
          {pillars.map(([n, t, d]) => (
            <div key={n}>
              <Num>{n}</Num>
              <h3 className={`mt-3 text-2xl font-bold tracking-tight ${BROWN}`}>{t}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[#4a5568]">{d}</p>
            </div>
          ))}
        </div>
      </div>
      <figure>
        <Image
          src={asset("prototype-front.webp")}
          alt="Monklap final prototype, front view"
          width={1411}
          height={1600}
          sizes="(min-width: 768px) 35vw, 80vw"
          className="mx-auto h-auto w-full max-w-md"
        />
        <figcaption>
          <Caption>Front view — final prototype</Caption>
        </figcaption>
      </figure>
    </section>
  );
}

function Demo() {
  return (
    <section className={`${SECTION} grid items-center gap-10 py-8 md:grid-cols-[0.8fr_1.2fr] md:py-12`}>
      <video
        className="mx-auto aspect-[9/16] max-h-[36rem] w-full max-w-[20rem] rounded-3xl bg-[#0b1426] object-cover"
        src={asset("monklap-demo.mp4")}
        autoPlay
        loop
        muted
        playsInline
        controls
        preload="metadata"
      />
      <div>
        <Eyebrow>In action</Eyebrow>
        <h2 className={`mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl ${INK}`}>
          Rest, wake, smile, <span className={BROWN}>pulse.</span>
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-[#4a5568]">
          Monklap sleeps with its screen dimmed. A hand and a clap wake it, it smiles back, and a 1.5-second burst of
          mist follows.
        </p>
      </div>
    </section>
  );
}

function TargetUsers() {
  const cards = [
    {
      n: "01",
      title: "Aesthetic & tech enthusiasts",
      body: "Gen Z and millennials looking for desk-friendly home objects with sound-driven, physical interaction rather than another standard IoT device.",
      tags: ["Desk setups", "Character objects"],
      img: "user-enthusiast.jpg",
      bg: "bg-[#f4e8d6]",
      numColor: "text-[#c69a72]",
      text: "text-[#101a2e]",
      sub: "text-[#4a5568]",
      tag: "border-[#1d6fa5]/40 text-[#1d6fa5]",
    },
    {
      n: "02",
      title: "Touchless, functional users",
      body: "People who need instant, hands-free odor control while cooking, caring for pets, or whenever their hands are busy.",
      tags: ["Kitchens", "Pets", "Busy hands"],
      img: "user-touchless.jpg",
      bg: "bg-[#bcae92]",
      numColor: "text-[#c9a27a]",
      text: "text-[#101a2e]",
      sub: "text-[#3b4658]",
      tag: "border-[#1d6fa5]/50 text-[#1d6fa5]",
    },
    {
      n: "03",
      title: "Experiential commercial spaces",
      body: "Pop-up stores, cafés and galleries that want interactive, sensory branding at the entrance — a scent that greets visitors.",
      tags: ["Pop-ups", "Cafés", "Galleries"],
      img: "user-commercial.jpg",
      bg: "bg-[#6e4529]",
      numColor: "text-[#c69a72]",
      text: "text-[#f4e8d6]",
      sub: "text-[#e7d6c0]",
      tag: "border-[#f4e8d6]/50 text-[#f4e8d6]",
    },
  ];
  return (
    <section className={SECTION}>
      <Eyebrow>03 — Target users</Eyebrow>
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Headline dark="Monklap" accent="is for…" />
        <p className="max-w-xs text-lg text-[#4a5568]">
          Three groups who want scent to feel like a moment of play, not another chore.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <article key={c.n} className={`flex flex-col rounded-[1.75rem] p-7 ${c.bg}`}>
            <div className="flex items-start justify-between gap-4">
              <span className={`text-6xl font-extrabold tracking-[-0.05em] ${c.numColor}`}>{c.n}</span>
              <Image
                src={asset(c.img)}
                alt=""
                width={480}
                height={288}
                className="h-auto w-36 rounded-xl object-cover sm:w-44"
              />
            </div>
            <h3 className={`mt-8 text-2xl font-bold leading-tight tracking-tight ${c.text}`}>{c.title}</h3>
            <p className={`mt-3 flex-1 text-[0.95rem] leading-relaxed ${c.sub}`}>{c.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <li
                  key={t}
                  className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] ${c.tag}`}
                >
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function SensorCard({
  kind,
  title,
  place,
  desc,
}: {
  kind: string;
  title: string;
  place: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl bg-[#f4e8d6] p-6">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#1d6fa5]">{kind}</p>
      <h3 className={`mt-3 text-2xl font-bold tracking-tight ${INK}`}>{title}</h3>
      <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#6b7686]">{place}</p>
      <p className="mt-6 text-[0.95rem] text-[#4a5568]">{desc}</p>
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="select-none text-center text-2xl text-[#1d6fa5] md:text-3xl">
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </span>
  );
}

function Sensors() {
  const states = [
    ["01", "Rest", "Nobody near, or no sound", "Screen dimmed", "bg-white", INK],
    ["02", "Wake", "Someone near + clap or noise", "Eyes open", "bg-white", INK],
    ["03", "Smile", "Recognizes the clap", "Smiles back", "bg-[#c69a72]", "text-[#101a2e]"],
    ["04", "Pulse", "Atomizer on for 1.5 s", "Then back to rest", "bg-[#6e4529]", "text-[#f4e8d6]"],
  ] as const;
  return (
    <section className={SECTION}>
      <Eyebrow>04 — ESP32 &amp; sensors</Eyebrow>
      <Headline dark="Two sensors," accent="two outcomes" className="mt-8" />

      <div className="mt-12 grid items-center gap-5 md:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
        <div className="grid gap-4">
          <SensorCard kind="Input · Sense" title="Ultrasonic sensor" place="Nostrils" desc="Checks that someone is near" />
          <SensorCard kind="Input · Sense" title="Sound sensor" place="Lower left" desc="Listens for a clap or noise" />
        </div>
        <Arrow />
        <div className="rounded-3xl bg-[#6e4529] p-7 text-[#f4e8d6]">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#d9bfa3]">Controller</p>
          <h3 className="mt-2 text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl">ESP32</h3>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-[#ead9c4]">
            Reads both sensors, picks a face, decides when to mist.
          </p>
          <p className="mt-6 inline-block rounded-full border border-dashed border-[#d9bfa3] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em]">
            USB 5V
          </p>
        </div>
        <Arrow />
        <div className="grid gap-4">
          <SensorCard kind="Output · Respond" title="2.8″ OLED display" place="Eyes" desc="Draws the face state" />
          <SensorCard kind="Output · Respond" title="Ultrasonic atomizer" place="Mouth" desc="Fires a 1.5 s burst of mist" />
        </div>
      </div>

      <Eyebrow className="mt-16">Interaction logic</Eyebrow>
      <ol className="mt-5 grid gap-3 md:grid-cols-4">
        {states.map(([n, t, d, r, bg, fg]) => (
          <li key={n} className={`rounded-2xl border border-[#d8e6f0] p-5 ${bg} ${fg}`}>
            <p className="flex items-baseline gap-3">
              <Num className={fg === INK ? "" : "text-[#d9bfa3]"}>{n}</Num>
              <span className="text-2xl font-bold tracking-tight">{t}</span>
            </p>
            <p className="mt-3 text-[0.95rem] opacity-80">{d}</p>
            <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] opacity-70">→ {r}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function InsideFace() {
  const faces = [
    ["rest", "01", "Rest", "Nobody near, or no sound", 520, 295],
    ["wake", "02", "Wake", "Someone near + clap or noise", 520, 264],
    ["smile", "03", "Smile", "Smiles back at the clap", 518, 242],
    ["pulse", "04", "Pulse", "1.5 s burst of mist", 520, 271],
  ] as const;
  return (
    <section className={SECTION}>
      <Eyebrow>05 — Inside the face</Eyebrow>
      <Headline dark="Wireframe breakdown" className="mt-8" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_17rem]">
        <figure className="overflow-x-auto">
          <Image
            src={asset("wireframe.jpg")}
            alt="Front and side wireframe of Monklap with labelled parts: OLED display, ultrasonic sensor, snap-fit hooks, atomizer, sound sensor, wick channel, bayonet tank, J-shaped wick"
            width={2200}
            height={1055}
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="h-auto min-w-[44rem] w-full lg:min-w-0"
          />
          <figcaption>
            <Caption>Hidden lines on — drawn from the Rhino model</Caption>
          </figcaption>
        </figure>
        <aside>
          <Eyebrow className="!text-[#7a4a2b]">Face states — real screen</Eyebrow>
          <ul className="mt-4 grid grid-cols-2 gap-5 lg:grid-cols-1">
            {faces.map(([f, n, t, d, w, h]) => (
              <li key={f}>
                <Image src={asset(`face-${f}.jpg`)} alt={`${t} face on the real screen`} width={w} height={h} className="h-auto w-full rounded-xl" />
                <p className="mt-2 flex items-baseline gap-2">
                  <Num>{n}</Num>
                  <span className={`text-xl font-bold tracking-tight ${INK}`}>{t}</span>
                </p>
                <p className="text-sm text-[#4a5568]">{d}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function Assembly() {
  const steps = [
    ["01", "Fill the tank", "Fill the tank with water and a water-soluble air freshener."],
    ["02", "Twist into the head", "The lid's bayonet locks into the head. A wick carries water up to the mouth."],
    ["03", "Hang it and clap", "A keyhole slot on the back hangs it on a single screw. No buttons. The face does the rest."],
  ];
  return (
    <section className={`${SECTION} grid items-center gap-12 md:grid-cols-[1fr_1fr]`}>
      <Image
        src={asset("assembly-exploded.webp")}
        alt="Exploded assembly: fill the tank, twist to lock, hang and clap"
        width={1600}
        height={1462}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="h-auto w-full max-w-xl justify-self-center"
      />
      <div>
        <Eyebrow>06 — System &amp; assembly</Eyebrow>
        <Headline dark="Fill, twist," accent="clap." className="mt-8" />
        <ol className="mt-10 divide-y divide-[#c9dbe8] border-t border-[#7a4a2b]">
          {steps.map(([n, t, d], i) => (
            <li key={n} className="grid grid-cols-[2rem_1fr_auto] gap-4 py-5">
              <Num className="pt-1.5">{n}</Num>
              <div>
                <h3 className={`text-xl font-bold tracking-tight ${INK}`}>{t}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-[#4a5568]">{d}</p>
              </div>
              {i === 2 ? (
                <Image src={asset("keyhole-back.jpg")} alt="Back of Monklap with the keyhole slot" width={384} height={512} className="h-20 w-auto rounded-lg" />
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-2xl bg-[#f4e8d6] p-5">
          <Eyebrow>What&apos;s inside the face</Eyebrow>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.95rem] text-[#4a5568]">
            {[
              ["Eyes", "OLED display"],
              ["Nostrils", "ultrasonic sensor"],
              ["Mouth", "ultrasonic atomizer"],
              ["Lower left", "sound sensor"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className={`inline font-bold ${INK}`}>{k}</dt> <dd className="inline">· {v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Sketches() {
  return (
    <section className={`${SECTION} grid gap-12 lg:grid-cols-[0.8fr_1.2fr]`}>
      <div>
        <Eyebrow>07 — Sketch &amp; ideation</Eyebrow>
        <Headline dark="From a button to" accent="a clap" className="mt-8" />
        <p className={`mt-8 max-w-md text-lg leading-relaxed ${INK}`}>
          Monklap began as a “Sound &amp; Scent System”: a comfort tool for public spaces that played music as people
          walked by, then sprayed fragrance on their wrists at the press of a button.
        </p>
        <dl className="mt-10 grid gap-5 border-t border-[#7a4a2b] pt-6 sm:grid-cols-[5rem_1fr]">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#4a5a6e]">Kept</dt>
          <dd className={INK}>Walk-up wake, a digital face, scent as a reward</dd>
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#4a5a6e]">Changed</dt>
          <dd className={INK}>The button became a clap; the form became a monkey</dd>
        </dl>
      </div>
      <div className="grid gap-6 sm:grid-cols-[1.15fr_0.85fr] sm:items-start">
        <figure>
          <Image src={asset("sketch-concept.jpg")} alt="Initial concept sketch: walk-by music and wrist spray" width={1120} height={1400} className="h-auto w-full rounded-2xl bg-white" />
          <figcaption>
            <Caption>Initial concept — walk-by music &amp; wrist spray</Caption>
          </figcaption>
        </figure>
        <figure>
          <Image src={asset("sketch-form.jpg")} alt="Form studies: head, sensors and tank" width={593} height={977} className="h-auto w-full rounded-2xl bg-white" />
          <figcaption>
            <Caption>Form studies — head, sensors &amp; tank</Caption>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Process() {
  const photos = [
    ["process-modeling.jpg", "Modeling", 906, 554],
    ["process-printing.jpg", "Printing", 1500, 2000],
    ["process-soldering.jpg", "Soldering", 681, 908],
    ["process-assembly.jpg", "Assembly", 1500, 2000],
  ] as const;
  const lessons = [
    ["Modeling", "Taking Monklap from rough sketches to 3D models in Rhino taught me that the more specific a plan is, the less time I lose troubleshooting changes later. I now understand not only how to model objects for real-world use, but also how to plan a project so each stage of making flows into the next with less friction."],
    ["3D printing", "I printed Monklap's parts from my Rhino models on a Bambu Lab A1 using Bambu Studio. Printing itself went smoothly, but some edges warped, so I had to sand those surfaces flat."],
    ["Soldering", "I troubleshot shorts caused by broken cords, cold solder joints and tangled stripped wires. Each time, I reopened the board, resoldered the joints and added hot glue so the same problem wouldn't happen again."],
    ["Assembly", "Using the joint structures I designed during modeling, I fitted the sensors, display and atomizer in order. My plans for the circuits and wick didn't always match reality, so it took a lot of trial and error. After four rounds of printing and fitting, I arrived at the current Monklap."],
  ];
  return (
    <section className={SECTION}>
      <Eyebrow>08 — Process &amp; lessons</Eyebrow>
      <Headline dark="Process & lessons" className="mt-8" />
      <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos.map(([src, label, w, h]) => (
          <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#d9e6ee]">
            <Image src={asset(src)} alt={label} width={w} height={h} sizes="(min-width: 768px) 25vw, 50vw" className="h-full w-full object-cover" />
            <span className="absolute bottom-3 left-3 rounded-full bg-[#6e4529] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#f4e8d6]">
              {label}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-12 grid gap-x-12 gap-y-0 md:grid-cols-2">
        {lessons.map(([t, d]) => (
          <div key={t} className="grid gap-2 border-t border-[#7a4a2b] py-6 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <h3 className={`text-xl font-bold tracking-tight ${INK}`}>{t}</h3>
            <p className="text-[0.95rem] leading-relaxed text-[#4a5568]">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Finale() {
  const shots = [
    ["final-front.jpg", "Front — awake", 900, 1111],
    ["final-three-quarter.jpg", "Three-quarter view", 900, 1111],
    ["final-mist.jpg", "Clap → pulse of mist", 1100, 1955],
  ] as const;
  return (
    <section className={`${SECTION} pb-24`}>
      <Eyebrow>09 — Final prototype</Eyebrow>
      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Headline dark="Monklap," accent="awake." />
        <p className="max-w-md text-lg leading-relaxed text-[#4a5568]">
          The finished Monklap: live OLED eyes, ultrasonic sensors in the nostrils and an atomizer in the mouth, all
          running on an ESP32.
        </p>
      </div>
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {shots.map(([src, cap, w, h]) => (
          <li key={src}>
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-[#cfdbe3]">
              <Image src={asset(src)} alt={cap} width={w} height={h} sizes="(min-width: 768px) 33vw, 100vw" className="h-full w-full object-cover" />
            </div>
            <Caption>{cap}</Caption>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MonklapPage() {
  return (
    <div className="monklap-page w-full bg-gradient-to-b from-[#eefbff] via-[#e3f6fd] to-[#dff0fb] font-sans">
      <Cover />
      <Overview />
      <Demo />
      <TargetUsers />
      <Sensors />
      <InsideFace />
      <Assembly />
      <Sketches />
      <Process />
      <Finale />
    </div>
  );
}
