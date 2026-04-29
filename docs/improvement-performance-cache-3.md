# Performance caching layer — Part 3

## Overview

This document covers component 3 of the Performance caching layer feature.

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| enabled | boolean | true | Enable this module |
| threshold | number | 3 | Processing threshold |
| timeout | number | 3000 | Timeout in ms |

## Usage

```javascript
import { init3 } from './improvement-performance-cache-3';
const config = init3({ threshold: 8 });
```

## Notes

- Requires Node.js >= 18
- Compatible with Stacks mainnet
- Part 3 of 5 in this PR
