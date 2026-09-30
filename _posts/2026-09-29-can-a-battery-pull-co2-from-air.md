---
title: "Can a battery pull CO2 out of the air?"
description: "Researchers built a battery-style device that captures carbon dioxide from the air with less energy than today's heat-based systems."
date: 2026-09-29 12:00:00 -0700
categories: [Papers]

paper:
  title: "A Ni(OH)2 symmetric battery cell for hydroxide exchange membrane-based direct air capture of CO2"
  authors: "Buchen, J. R.; Wang, T.; Geiger, B. K.; et al."
  journal: "Nature Energy"
  year: "2026"
  status: "Peer-reviewed"
  url: "https://doi.org/10.1038/s41560-026-02129-z"

glance:
  question: "Can a battery-style device that runs on electricity capture CO<sub>2</sub> from the air using much less energy than today's heat-based machines?"
  found: "A pilot stack of nine cells captured CO<sub>2</sub> at 0.83 MWh per ton, compared with 1.8 to 3.1 MWh per ton for current systems, and a small lab cell ran for 5,000 hours."
  catch: "The pilot ran for only 48 hours, the energy figure comes from the cell's voltage (fans and compressors are still to be added), and several authors have business ties to the technology."

vocab:
  - es: captura directa de aire
    en: direct air capture
    note: "Often shortened to DAC in English."
  - es: hidróxido
    en: hydroxide
    note: "Cognate, but note the accent mark. Written OH-."
  - es: membrana
    en: membrane
    note: "Cognate: a thin sheet that lets some things through and blocks others."
  - es: electrodo
    en: electrode
    note: "Cognate: the surface where the chemical reaction happens."
  - es: cátodo y ánodo
    en: cathode and anode
    note: "Note the accent marks. In this device the two swap jobs every cycle."
  - es: carbonato
    en: carbonate
    note: "Cognate: what CO2 turns into when it reacts with hydroxide."
  - es: caída de presión
    en: pressure drop
    note: "Literally 'fall of pressure': how hard a fan must work to push air through."
  - es: curva de aprendizaje
    en: learning curve
    note: "Things get cheaper the more of them we build."
  - es: batería
    en: battery
    note: "In Mexico, pila usually means a small battery, like an AA."
---
*Imagine a machine that works like a rechargeable battery, but instead of storing electricity, it pulls carbon dioxide out of thin air.*

## The big question
To reach net-zero emissions, the world will likely need to *remove* CO<sub>2</sub> that is already in the air, not just stop adding more. Machines that do this are called direct air capture, or DAC. The paper describes it as a critical technology for offsetting ongoing emissions from spread-out sources, like agriculture and construction.[^1]

The hard part is energy. Air is only about 0.04% CO<sub>2</sub> (400 parts per million), so grabbing it takes a lot of work. Today's large systems use heat to catch and release the CO<sub>2</sub>, and the paper cites an energy cost of 1.8 to 3.1 megawatt-hours (MWh) for every ton captured.[^3] A megawatt-hour is 1,000 kilowatt-hours, roughly a month of electricity for an average US home. The US Department of Energy has set a goal of $100 per ton.[^2]

So the question: can a device that runs on electricity instead of heat capture CO<sub>2</sub> with less energy, last a long time, and scale up?

## What they did
The device is built like a sandwich: two identical nickel hydroxide electrodes with a thin membrane in the middle. Nickel hydroxide is a material already used in common nickel-metal hydride rechargeable batteries, which is why the authors call it a "battery cell."[^1] Air flows through one side, and the CO<sub>2</sub> is released into a gas stream on the other.

The trick is pH. In our [pH post]({{ '/2026/09/que-es-el-ph/' | relative_url }}) we saw that basic and less basic liquids behave differently. Here that difference does the work:

1. **Make one side basic.** At the cathode, the battery reaction makes hydroxide, which is strongly basic. CO<sub>2</sub> from the air reacts with it and gets locked away as carbonate.
2. **Make the other side less basic.** At the anode, the opposite reaction uses up hydroxide. The pH drops, and the carbonate lets go of its CO<sub>2</sub> as a concentrated stream that can be collected.
3. **Recharge and flip.** When the cathode runs out of "battery," a regeneration step uses oxygen from the air to keep making hydroxide while the other side finishes charging. This step is needed because some of the electricity at the anode goes to making oxygen instead of charging. Then the electrodes swap jobs, and the airflow switches sides.

The two sides differ by only about 2.8 pH units. Since each pH unit is a factor of 10, that is roughly a 600-fold difference in acidity. Keeping it up is the main voltage cost, about 0.17 volts, a fraction of a single AA battery's 1.5 volts.[^1]

They tested it three ways: a lab cell about 2 inches square (25 cm<sup>2</sup>), a long durability run with the same size of cell, and a pilot stack of nine cells, 300 cm<sup>2</sup> each.

## What they found
| Test | Size | How long | Energy (MWh per ton) | Capture rate (kg of CO<sub>2</sub> per m<sup>2</sup> per year) |
|---|---|---|---|---|
| First lab test | one 25 cm<sup>2</sup> cell | about 30 hours | 1.15 | 78 |
| Durability test | one 25 cm<sup>2</sup> cell | 5,000 hours (three stretches shown) | 0.67, then 0.53, then 0.46 | 48, then 60, then 62 |
| Pilot stack | nine cells, 300 cm<sup>2</sup> each | 48 hours | 0.83 | 75 |

The tests used different electrodes and settings, and the first row includes the regeneration step, so compare the trends more than the exact numbers.

> About 0.83 MWh per ton in the pilot stack, versus 1.8 to 3.1 MWh for today's heat-based systems.

A few details make the numbers easier to picture:

- **It got better with age.** During the long test the energy cost improved from 0.67 to 0.46 MWh per ton. The authors link this to the electrodes gaining capacity, probably because bare nickel underneath slowly turned into more nickel hydroxide, a process that stops on its own once the nickel is used up. Capacity rose between the first two stretches but not between the second and third, which supports that idea.
- **The air moves easily.** The fans that push air through the device also use energy, and the paper treats a pressure drop of 300 pascals as an upper limit for reasonable fan costs. The lab cell measured 2,800 pascals. The scaled-up stack came in under 300, about ten times lower, with similar performance.
- **The cost projection.** The first pilot plant is calculated at $566 per ton. The paper projects $92 per ton after several generations of bigger plants, assuming costs fall along a learning curve like solar panels and lithium-ion batteries (a 20% learning rate, which the paper says matches lithium-ion battery packs) and that bigger plants cost less per unit (15% less capital cost each time the plant size doubles).

## Why it matters
Energy is the biggest running cost of pulling CO<sub>2</sub> out of the air, so any design that cuts it makes carbon removal cheaper. This one runs on electricity, so it could use solar or wind power, and it is built around a battery material with a long track record. The authors expect costs to fall the way they did for solar panels and batteries: the more that get built, the cheaper each one gets.

## Keep in mind
- **What this study does not show:** a full-size plant. The pilot stack ran for 48 hours, while the 5,000-hour test used a single small cell. The energy figure is calculated from the cell's voltage and the CO<sub>2</sub> captured, and the paper says a blower and compressor are still to be added in later generations. The 1.8 MWh comparison is also the low end of the range the paper cites.
- **Limits the authors mention:** *electron efficiency*, the number of CO<sub>2</sub> molecules captured per electron, can reach at most 1. The pilot stack reached 0.26, and the best stretch of the long test reached 0.43. They say the cost figures are estimates that rest on assumptions, and that the far-future numbers are the most uncertain.
- **Who is involved:** several authors co-founded or work for companies tied to this technology, including Versogen (which makes the membrane used) and RepAir DAC (the company scaling it up). The paper discloses this, and it is peer-reviewed in Nature Energy, but it is useful context. Funding came from the US Department of Energy and the US Army Research Laboratory.
- **What is still unknown:** whether performance holds at a thousand tons per year and beyond.

## In one sentence
A nickel-hydroxide "battery" that soaks up CO<sub>2</sub> from the air looks promising, since a small cell ran for about seven months and a pilot stack used 0.83 MWh per ton, but it is still unproven at full scale and rests on cost assumptions.

## Sources
[^1]: Buchen, J. R., Wang, T., Geiger, B. K., Gluz, N. Y., Artoul, M., Hiegel, J.-P., Achrai, B., Setzler, B. P. & Yan, Y. "A Ni(OH)<sub>2</sub> symmetric battery cell for hydroxide exchange membrane-based direct air capture of CO<sub>2</sub>." *Nature Energy* (2026). [https://doi.org/10.1038/s41560-026-02129-z](https://doi.org/10.1038/s41560-026-02129-z)
[^2]: *Carbon Negative Shot* (US Department of Energy, 2022), as cited in the paper. [https://www.energy.gov/documents/strategy-carbon-negative-shot](https://www.energy.gov/documents/strategy-carbon-negative-shot)
[^3]: The paper cites McQueen, N. et al., *Prog. Energy* (2021), [https://doi.org/10.1088/2516-1083/abf1ce](https://doi.org/10.1088/2516-1083/abf1ce), and *Direct Air Capture 2022* (International Energy Agency, 2022), [https://www.iea.org/reports/direct-air-capture-2022](https://www.iea.org/reports/direct-air-capture-2022), for the 1.8 to 3.1 MWh per ton range.
