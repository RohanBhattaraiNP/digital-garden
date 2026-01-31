---
title: Neural Networks - From Scratch Understanding
date: 2025-12-05
category: Machine Learning
tags: [ml, deep-learning, neural-networks, backpropagation]
---

# Neural Networks: Building Intuition

After implementing neural networks from scratch multiple times, here's what actually matters.

## The Core Idea

A neural network is just a fancy function approximator:

$$f(x; \theta) \approx y$$

Where $\theta$ represents all learnable parameters (weights and biases).

## Forward Pass

Layer computation:

$$h^{(l)} = \sigma(W^{(l)}h^{(l-1)} + b^{(l)})$$

Where:
- $h^{(l)}$ = activations at layer $l$
- $W^{(l)}$ = weight matrix
- $b^{(l)}$ = bias vector
- $\sigma$ = activation function (ReLU, tanh, etc.)

## Backpropagation

The magic of training - chain rule in action:

$$\frac{\partial L}{\partial W^{(l)}} = \frac{\partial L}{\partial h^{(l)}} \cdot \frac{\partial h^{(l)}}{\partial W^{(l)}}$$

```python
import numpy as np

class NeuralNetwork:
    def __init__(self, layers):
        self.weights = []
        self.biases = []
        
        for i in range(len(layers)-1):
            W = np.random.randn(layers[i], layers[i+1]) * 0.01
            b = np.zeros((1, layers[i+1]))
            self.weights.append(W)
            self.biases.append(b)
    
    def forward(self, X):
        self.activations = [X]
        A = X
        
        for W, b in zip(self.weights, self.biases):
            Z = np.dot(A, W) + b
            A = self.relu(Z)
            self.activations.append(A)
        
        return A
    
    def relu(self, Z):
        return np.maximum(0, Z)
    
    def relu_derivative(self, Z):
        return (Z > 0).astype(float)
```

## Loss Functions

### Mean Squared Error

$$L_{MSE} = \frac{1}{n}\sum_{i=1}^n(y_i - \hat{y}_i)^2$$

### Cross-Entropy

$$L_{CE} = -\sum_{i=1}^n y_i \log(\hat{y}_i)$$

## Optimization

Adam optimizer (my go-to):

$$m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t$$
$$v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2$$

$$\theta_t = \theta_{t-1} - \frac{\alpha}{\sqrt{v_t} + \epsilon}m_t$$

## Real Applications

I use neural networks for:
- Signal classification in [[particle-physics]] experiments
- Energy reconstruction in particle detectors
- Background noise filtering
- See [[transformer-attention]] for advanced architectures

## Key Lessons

1. **Architecture matters less than data**
2. **Regularization prevents overfitting**
3. **Learning rate is crucial**
4. **Batch normalization helps convergence**

Related: [[transformer-attention]]
