# Custom board skins and themes — Part 3

## Overview

This document covers component 3 of the Custom board skins and themes feature.

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| enabled | boolean | true | Enable this module |
| threshold | number | 3 | Processing threshold |
| timeout | number | 3000 | Timeout in ms |

## Usage

```javascript
import { init3 } from './feature-custom-board-skins-3';
const config = init3({ threshold: 8 });
```

## Notes

- Requires Node.js >= 18
- Compatible with Stacks mainnet
- Part 3 of 10 in this PR
