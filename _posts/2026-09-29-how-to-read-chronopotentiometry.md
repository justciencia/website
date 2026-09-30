---
title: "How to read a chronopotentiometry graph"
description: "The name sounds scary, but the graph is just voltage against time while the current stays constant. Here is how to read it."
date: 2026-09-29 13:00:00 -0700
categories: [Graphs]
scripts: [cp-explorer, cp-scrolly]

graph:
  name: "Chronopotentiometry"
  x: "Time, in seconds, minutes, or hours"
  y: "Potential, in volts, measured against a reference electrode"
  set: "A constant current, often written per area, like mA/cm<sup>2</sup>"
  learn: "Which reaction is happening, how long the material lasts, and how stable the cell is"

vocab:
  - es: gráfica
    en: graph
    note: "You may also see gráfico, especially in Spain."
  - es: eje
    en: axis
    note: "Plural: ejes."
  - es: cronopotenciometría
    en: chronopotentiometry
    note: "Cognate: crono means time, potencio means potential."
  - es: potencial
    en: potential
    note: "Cognate. In electrochemistry it is measured in volts."
  - es: corriente
    en: current
    note: "Also the word for a stream of water or air."
  - es: meseta
    en: plateau
    note: "Literally a high flat area of land, like a mesa. Same idea on a graph."
  - es: sobrepotencial
    en: overpotential
    note: "The extra push a reaction needs to run at a useful speed. Sometimes written sobretensión."
  - es: electrodo de referencia
    en: reference electrode
    note: "The sea level for voltage."
  - es: resistencia
    en: resistance
    note: "Cognate."
  - es: carga
    en: charge
    note: "Also the word for charging a battery."
---
*Batteries, electrolyzers, and sensors are all tested with one simple question: what does the voltage do while we push a steady current through?*

## The setup
**Chronopotentiometry** is three words glued together: *chrono* (time), *potentio* (potential), and *-metry* (measuring). You measure how the potential changes over time.

To do it, you push a steady current through an electrode, like holding a garden hose at a constant flow. Then you watch the potential, which is like the pressure needed to keep that flow going. It is also called a *galvanostatic* measurement, so you will see both names.[^1]

## The axes
- **X-axis: time**, in seconds, minutes, or hours.
- **Y-axis: potential**, in volts, measured against a reference electrode. Think of it as sea level for voltage: a height only means something compared to something else. Look for labels like "vs. RHE" or "vs. Ag/AgCl."
- **Not on the graph: the current.** You set it, so it isn't an axis, but the caption should say what it was. It is usually written per area, like mA/cm<sup>2</sup>, so big and small cells can be compared.

## Follow the curve

<div class="scrolly" id="cp-scrolly">
  <div class="scrolly-stage" aria-hidden="false">
    <div class="scrolly-graph"></div>
    <div class="scrolly-caption"></div>
  </div>
  <div class="scrolly-steps">
    <div class="step" data-step="0">
      <div class="step-n">Start here</div>
      <h3>Two axes, one story</h3>
      <p>Time runs left to right. Potential, the electrical pressure on the electrode, runs up and down. The current is held constant, so it never shows up on the graph. Keep scrolling and the curve will draw itself.</p>
    </div>
    <div class="step" data-step="1">
      <div class="step-n">1 &middot; The jump</div>
      <h3>The moment the current switches on</h3>
      <p>Before the experiment starts, the electrode sits at its resting potential. The instant the current turns on, the potential drops quickly. Part of that drop is the cell&rsquo;s resistance, and part is the reaction getting started.</p>
    </div>
    <div class="step" data-step="2">
      <div class="step-n">2 &middot; The plateau</div>
      <h3>A flat line is a fingerprint</h3>
      <p>The curve settles onto a flat stretch. That level is the potential where the first reaction happens, and each reaction has its own. How long the plateau lasts tells you how much material there was to react.</p>
    </div>
    <div class="step" data-step="3">
      <div class="step-n">3 &middot; The transition</div>
      <h3>When the material runs out</h3>
      <p>Then the potential suddenly falls. The first material is used up, so something else has to carry the current. The time at this drop, marked &tau;, is how long the material lasted.</p>
    </div>
    <div class="step" data-step="4">
      <div class="step-n">4 &middot; The second plateau</div>
      <h3>A new reaction takes over</h3>
      <p>The curve settles again, this time at a new level. A different reaction is now supplying the current. It might be another material, or a side reaction like making gas.</p>
    </div>
  </div>
</div>

## Try it yourself
Slide the current and the amount of material and watch what happens. Tap the numbered chips, or the dots on the graph, to see what each part means.

<div id="cp-explorer" class="cpx"><p>This activity needs JavaScript.</p></div>

## What the graph tells you
1. **Which reaction is happening: the height of the plateau.** Each reaction happens at its own potential, a bit like a fingerprint.
2. **How much material there was: the length of the plateau.** Charge equals current × time, so with the same material, doubling the current makes the plateau half as long. In batteries this is called the *capacity*.
3. **How efficient it is: the level of the plateau.** In an electrolyzer, a lower voltage at the same current means less electricity is used for the same product (energy = voltage × current × time). The difference comes from the overpotential, the extra push a reaction needs, plus the cell's resistance.
4. **How stable it is: drift over time.** A flat line is stable. In an electrolyzer running at constant current, a line that creeps upward usually means something is wearing out.

## Watch out
- **Check the reference.** −0.3 V vs. Ag/AgCl and −0.3 V vs. RHE are different places.
- **One electrode or the whole cell?** Some graphs show the potential of a single electrode, measured against a reference. Others show the voltage of the whole cell. The caption should say which.
- **Check the units on the current.** 2 mA and 2 mA/cm<sup>2</sup> are very different, because the second is per area.
- **Signs.** By convention, reduction currents are often written as negative, so the potential may drop instead of rise. Check the sign convention.
- **Noise.** Gas bubbles can make the line wiggle.

## Where you'll see it
In our [paper post on capturing CO<sub>2</sub> with a battery-style device]({{ '/2026/09/can-a-battery-pull-co2-from-air/' | relative_url }}), the voltage-versus-time graphs are constant-current measurements. When the nickel electrode ran out of its active material, the cell voltage jumped sharply, the same "transition" you can see above.[^2]

Its sibling is **chronoamperometry**: hold the potential steady and watch the current instead.

## In one sentence
Chronopotentiometry holds the current steady and shows how the potential changes over time: the plateau's height points to the reaction, its length tells you how much material there was, and any drift tells you how stable the system is.

## Sources
[^1]: Bard, A. J. & Faulkner, L. R. *Electrochemical Methods: Fundamentals and Applications*, 2nd ed. (Wiley, 2001). A standard reference for these techniques.
[^2]: Buchen, J. R. et al. "A Ni(OH)<sub>2</sub> symmetric battery cell for hydroxide exchange membrane-based direct air capture of CO<sub>2</sub>." *Nature Energy* (2026), Fig. 2 and Extended Data Fig. 3. [https://doi.org/10.1038/s41560-026-02129-z](https://doi.org/10.1038/s41560-026-02129-z)
