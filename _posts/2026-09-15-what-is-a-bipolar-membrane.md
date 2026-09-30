---
title: "What is a bipolar membrane?"
description: "Glue two plastic films together, one that passes positive ions and one that passes negative ions, and you get a device that can split water at the seam."
categories: [Electrochemistry]
---
*This is a sample post. Edit or delete it, then add your own in the `_posts` folder.*

Most of the membranes in electrochemistry do one job: let one kind of ion through and block the rest. A **cation-exchange membrane** passes positive ions such as protons. An **anion-exchange membrane** passes negative ions such as hydroxide.

A **bipolar membrane** is both of those, laminated into one sheet. One layer passes positive ions, the other passes negative ions, and where they meet there is a thin junction with a remarkable trick.

## The trick at the seam

Orient the sheet so that the proton-passing layer faces the negative electrode and the hydroxide-passing layer faces the positive electrode. Now apply a voltage. Water at the junction has nowhere else to go, so it splits into a proton and a hydroxide ion. Each one is pushed out through its own layer, toward the electrode that wants it.

The result is a membrane that makes acid on one side and base on the other, from nothing but water and electricity.

## Why that helps an electrolyzer

Different half-reactions like different pH. Making hydrogen runs well in acid. Making oxygen runs well in base, and in base you can use catalysts that are cheaper and more abundant than the platinum-group metals acid demands. A bipolar membrane lets each electrode sit in the environment it prefers, inside one device.

It isn't free. Holding two sides of a cell at very different pH costs energy: about 59 millivolts for every pH unit, or roughly 0.83 volts for a 14-unit gap.

| Membrane | Passes | Typical electrode environment |
|---|---|---|
| Cation-exchange (PEM) | Positive ions, e.g. H<sup>+</sup> | Acidic on both sides |
| Anion-exchange (AEM) | Negative ions, e.g. OH<sup>&minus;</sup> | Basic on both sides |
| Bipolar | Both, split at a junction | Acidic on one side, basic on the other |

## Where it gets interesting

The membrane's layers also decide which *other* ions get through. That matters a great deal when your water isn't clean: it affects whether chloride reaches the electrode where it can turn into chlorine, which is the [problem with seawater]({{ '/2026/09/why-not-just-split-seawater/' | relative_url }}). Controlling that crossover is an active research problem.
