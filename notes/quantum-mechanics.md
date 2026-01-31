---
title: Quantum Mechanics - Graduate Level Notes
date: 2025-12-03
category: Physics
tags: [physics, quantum-mechanics, caltech, ph125]
---

# Quantum Mechanics (Ph 125abc)

My notes from Caltech's graduate quantum mechanics sequence. This is where physics gets truly mind-bending.

## The Schrödinger Equation

Time-dependent form:

$$i\hbar\frac{\partial}{\partial t}|\Psi(t)\rangle = \hat{H}|\Psi(t)\rangle$$

Time-independent (energy eigenstates):

$$\hat{H}|\psi_n\rangle = E_n|\psi_n\rangle$$

## Core Postulates

### 1. State Vector

The state of a quantum system is described by a vector $|\Psi\rangle$ in Hilbert space:

$$|\Psi\rangle = \sum_n c_n|n\rangle$$

Where $\sum_n |c_n|^2 = 1$ (normalization).

### 2. Observables as Operators

Physical quantities are represented by Hermitian operators:

$$\hat{A}^\dagger = \hat{A}$$

### 3. Measurement

Measuring observable $\hat{A}$ collapses the state:

$$P(a_n) = |\langle a_n|\Psi\rangle|^2$$

## Heisenberg Uncertainty Principle

$$\Delta x \cdot \Delta p \geq \frac{\hbar}{2}$$

More general form:

$$\Delta A \cdot \Delta B \geq \frac{1}{2}|\langle[\hat{A},\hat{B}]\rangle|$$

## Applications in My Research

### Particle Detection

In [[particle-physics]], quantum mechanics governs:

$$|\text{particle}\rangle = \alpha|\text{detected}\rangle + \beta|\text{missed}\rangle$$

### Decay Processes

K-long decay in LDMx:

$$\Gamma = \frac{2\pi}{\hbar}|\langle f|H_{int}|i\rangle|^2\rho(E_f)$$

Fermi's Golden Rule!

## Perturbation Theory

For small perturbations $\hat{H} = \hat{H}_0 + \lambda\hat{V}$:

$$E_n = E_n^{(0)} + \lambda E_n^{(1)} + \lambda^2 E_n^{(2)} + ...$$

First-order energy correction:

$$E_n^{(1)} = \langle n^{(0)}|\hat{V}|n^{(0)}\rangle$$

## Quantum Harmonic Oscillator

$$\hat{H} = \frac{\hat{p}^2}{2m} + \frac{1}{2}m\omega^2\hat{x}^2$$

Energy eigenvalues:

$$E_n = \hbar\omega\left(n + \frac{1}{2}\right), \quad n = 0,1,2,...$$

Using ladder operators:

$$\hat{a}|n\rangle = \sqrt{n}|n-1\rangle$$
$$\hat{a}^\dagger|n\rangle = \sqrt{n+1}|n+1\rangle$$

## Spin and Angular Momentum

$$\hat{J}^2|j,m\rangle = \hbar^2 j(j+1)|j,m\rangle$$
$$\hat{J}_z|j,m\rangle = \hbar m|j,m\rangle$$

## Mind-Blowing Realizations

1. **Superposition** isn't just math - it's reality
2. **Measurement** fundamentally changes the system
3. **Entanglement** connects particles across space
4. **Tunneling** allows impossible classical processes

## Connections

- [[particle-physics]] uses this daily
- [[veritasium-quantum]] explains it beautifully
- [[3blue1brown-essence]] gives the mathematical intuition

This is the foundation of everything in modern physics!

Related: [[particle-physics]]
