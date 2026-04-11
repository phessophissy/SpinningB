# Referral system with tracking codes — Part 3

## Overview

This document covers component 3 of the Referral system with tracking codes feature.

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| enabled | boolean | true | Enable this module |
| threshold | number | 3 | Processing threshold |
| timeout | number | 3000 | Timeout in ms |

## Usage

```javascript
import { init3 } from './feature-referral-system-3';
const config = init3({ threshold: 8 });
```

## Notes

- Requires Node.js >= 18
- Compatible with Stacks mainnet
- Part 3 of 15 in this PR
