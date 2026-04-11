# Add loading states and skeleton screens — Part 13

## Overview

This document covers component 13 of the Add loading states and skeleton screens feature.

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| enabled | boolean | true | Enable this module |
| threshold | number | 13 | Processing threshold |
| timeout | number | 13000 | Timeout in ms |

## Usage

```javascript
import { init13 } from './improvement-loading-states-13';
const config = init13({ threshold: 18 });
```

## Notes

- Requires Node.js >= 18
- Compatible with Stacks mainnet
- Part 13 of 15 in this PR
