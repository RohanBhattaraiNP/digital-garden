---
title: Attention Mechanism in Transformers
date: 2025-12-06
category: Machine Learning
tags: [ml, deep-learning, transformers, nlp, attention]
---

# Understanding Attention in Transformers

The attention mechanism is the core innovation that powers GPT, BERT, and modern AI systems. Here's my understanding after implementing it from scratch.

## The Problem

Traditional RNNs process sequences sequentially, creating a bottleneck. How can we allow the model to "attend" to all parts of the input simultaneously?

## Self-Attention Formula

The scaled dot-product attention:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Where:
- $Q$ = Queries (what we're looking for)
- $K$ = Keys (what each position offers)
- $V$ = Values (the actual information)
- $d_k$ = dimension of keys (for scaling)

## Why It Works

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.size(-1)
    
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k))
    
    # Apply softmax to get attention weights
    attention_weights = F.softmax(scores, dim=-1)
    
    # Weighted sum of values
    output = torch.matmul(attention_weights, V)
    
    return output, attention_weights
```

## Multi-Head Attention

Running attention in parallel with different learned projections:

$$\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,...,\text{head}_h)W^O$$

Where each head is:

$$\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

## Applications

- **Language Models**: GPT-4, ChatGPT
- **Computer Vision**: Vision Transformers (ViT)
- **Science**: AlphaFold for protein folding
- My work: Event classification in [[particle-physics]]

## Key Insight

Attention lets the model dynamically decide what's important, rather than having a fixed receptive field like CNNs.

Related: [[neural-networks]], [[veritasium-quantum]]
