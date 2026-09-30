---
title: "Why can't we just split seawater?"
description: "Electrolysis turns water and electricity into hydrogen. Seawater is the most abundant water on Earth, and it fights back."
categories: [Electrochemistry]
---
*This is a sample post. Edit or delete it, then add your own in the `_posts` folder.*

Making hydrogen from water sounds like a solved problem. You put two electrodes in water, run a current through it, and hydrogen bubbles off one electrode while oxygen bubbles off the other. High school chemistry classes do it with a nine-volt battery.

The catch is scale. Making a meaningful amount of clean hydrogen takes a lot of water, and the water most of us can reach in bulk is the ocean. So why isn't every electrolyzer just plugged into the sea?

## What the ocean adds to the water

Seawater carries roughly 35 grams of dissolved salt in every liter, and most of that is sodium chloride. Two things in that salt cause trouble.

**Chloride.** At the positive electrode, we want water to give up electrons and become oxygen. Chloride ions can give up electrons too, and when they do they make chlorine, a corrosive, toxic gas that also eats catalysts and membranes. On paper oxygen wins by a small margin. In practice chlorine is easier to make, because it only needs two electrons per molecule where oxygen needs four.

**Calcium and magnesium.** At the negative electrode, the local chemistry turns basic. Calcium and magnesium respond by precipitating as solid hydroxides, which coat surfaces and clog the membrane, like limescale in a kettle.

> Oxygen is the product we want. Chlorine is the one that's easier to make.

## The obvious question

Why not just remove the salt first?

{: .callout}
**A fair objection.** Making one kilogram of hydrogen takes about nine liters of water and something like fifty kilowatt-hours of electricity. Desalinating nine liters by reverse osmosis costs a tiny fraction of that energy, well under a tenth of a percent. So for a large plant next to the coast, "purify first" works, and it is what most projects do.

The case for tolerating impure water is about robustness and simplicity. Extra purification hardware is one more thing to build, power, and maintain at a remote site. And an electrolyzer that shrugs off contaminants is also more forgiving of ordinary tap water, industrial wastewater, and the day the pretreatment system fails.

## Three ways to fight back

1. **Purify the water.** Reliable, and the default today.
2. **Make the catalyst pickier.** Design the positive electrode so oxygen is strongly favored over chlorine.
3. **Change the membrane.** Put a barrier between the seawater and the electrode where chlorine would form, so chloride never gets there.

The third is an active research area. One promising approach uses bipolar membranes, which I'll explain in the [next post]({{ '/2026/09/what-is-a-bipolar-membrane/' | relative_url }}), to keep chloride away from the electrode where chlorine would form.

Seawater is not impossible to split. It just asks you to design the whole device around what's in it.
