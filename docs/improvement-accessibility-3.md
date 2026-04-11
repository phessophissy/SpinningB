# Accessibility improvements (ARIA, focus) — Part 3

## Overview

This document covers component 3 of the Accessibility improvements (ARIA, focus) feature.

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| enabled | boolean | true | Enable this module |
| threshold | number | 3 | Processing threshold |
| timeout | number | 3000 | Timeout in ms |

## Usage

```javascript
import { init3 } from './improvement-accessibility-3';
const config = init3({ threshold: 8 });
```

## Notes

- Requires Node.js >= 18
- Compatible with Stacks mainnet
- Part 3 of 15 in this PR
