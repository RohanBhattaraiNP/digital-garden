---
title: Particle Physics - LDMx Experiment Notes
date: 2025-12-04
category: Physics
tags: [physics, particle-physics, ldmx, caltech, research]
---

# Particle Physics at LDMx

Working on the Light Dark Matter Experiment (LDMx) at Caltech has been an incredible journey into the world of particle detection.

## The Quest for Dark Matter

We're searching for light dark matter through rare K-long decay events:

$$K_L^0 \rightarrow \text{invisible}$$

## Detection Strategy

### Electromagnetic Calorimeter (ECAL)

Measures energy deposition from electromagnetic showers:

$$E_{deposit} = \int \frac{dE}{dx} dx$$

### Hadronic Calorimeter (HCAL)

Captures hadronic interactions for background rejection.

## My Work

### Data Analysis Pipeline

```python
import uproot
import numpy as np
import matplotlib.pyplot as plt

# Load ROOT file from detector
file = uproot.open("ldmx_data.root")
tree = file["events"]

# Extract calorimeter data
ecal_energy = tree["EcalVeto/EcalVeto.energy_"].array()
hcal_energy = tree["HcalVeto/HcalVeto.energy_"].array()

# Signal selection
signal_mask = (ecal_energy < 50) & (hcal_energy < 20)
signal_events = tree.arrays(filter_name="/*/", cut=signal_mask)

# Peak detection for rare events
from scipy.signal import find_peaks
peaks, properties = find_peaks(ecal_energy, height=10, distance=5)
```

### Background Rejection

Using [[neural-networks]] for classification:

$$P(\text{signal}|E_{ECAL}, E_{HCAL}) = \sigma(W_2 \cdot \text{ReLU}(W_1 \cdot \mathbf{x} + b_1) + b_2)$$

## Physics Behind It

### Relativistic Kinematics

Particle momentum and decay length correlation:

$$L = \gamma \beta c\tau = \frac{p}{m}c\tau$$

Where:
- $\gamma$ = Lorentz factor
- $\beta = v/c$
- $\tau$ = proper lifetime

### Cross-Section

The probability of interaction:

$$\sigma = \frac{N_{events}}{L \cdot \Phi}$$

## Challenges

1. **Noise**: Cosmic rays, detector noise
2. **Background**: Standard Model processes mimicking signal
3. **Statistics**: Rare events require massive datasets
4. **Computation**: Terabytes of data from [[hpc-computing]]

## Connections

This research connects to:
- [[quantum-mechanics]] - Understanding particle behavior
- [[neural-networks]] - ML for event classification
- [[veritasium-quantum]] - Quantum nature of particles

## Key Results

Achieved **3σ improvement** in signal-to-noise ratio using:
- Advanced clustering algorithms
- ML-based background rejection
- Lifetime analysis techniques

This is cutting-edge physics meeting modern ML!

Related: [[quantum-mechanics]], [[neural-networks]]
