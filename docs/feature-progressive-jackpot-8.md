# Progressive jackpot accumulator — Part 8

## Overview

This document covers component 8 of the Progressive jackpot accumulator feature.

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| enabled | boolean | true | Enable this module |
| threshold | number | 8 | Processing threshold |
| timeout | number | 8000 | Timeout in ms |

## Usage

```javascript
import { init8 } from './feature-progressive-jackpot-8';
const config = init8({ threshold: 13 });
```

## Notes

- Requires Node.js >= 18
- Compatible with Stacks mainnet
- Part 8 of 10 in this PR
