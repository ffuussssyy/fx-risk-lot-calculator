# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run Vitest test suite
- `npm run preview` - Preview production build

### Testing
- Tests are written with Vitest and located alongside source files (e.g., `calculator.test.ts`)
- Test files use `.test.ts` suffix
- Run `npm test` to execute all tests

## Application Architecture

### Core Structure
This is a React 19 + TypeScript FX risk calculator for Japanese traders. The app calculates appropriate lot sizes based on account balance, risk percentage, and stop-loss pips.

### Key Modules

#### `/src/utils/calculator.ts`
Main calculation orchestrator that:
- Coordinates all risk calculation logic
- Validates inputs and handles currency pair conversions
- Returns comprehensive `CalculationResult` with lot sizes, margins, and take-profit levels

#### `/src/utils/lotCalculator.ts`
Precise lot calculation engine using integer step arithmetic:
- Implements 0.01 lot increments with floor rounding
- Uses `LOT_STEP_MULTIPLIER = 100` to avoid floating-point errors
- Converts between raw lots, steps, and units (1 lot = 100,000 units)

#### `/src/utils/notionalCalculator.ts`
Currency conversion and margin calculations:
- Handles JPY-based account currency conversions
- Calculates notional amounts for both JPY pairs (USDJPY) and cross pairs (EURUSD)
- Requires conversion rates for non-JPY quote currencies

#### `/src/utils/urlState.ts`
URL state persistence for sharing calculations:
- Saves all form inputs to URL query parameters
- Enables sharing calculation setups via URL
- Automatically restores state on page load

#### `/src/utils/formatters.ts`
Display formatting utilities for prices, currencies, and lots.

### Calculation Logic
1. **Pip Value**: Calculated as `1 lot × pip_size × 100,000` in quote currency, converted to JPY if needed
2. **Recommended Lot**: `(balance × risk%) / (pip_value_JPY × stop_loss_pips)` rounded down to 0.01 lot increments
3. **Take Profit**: Entry price ± (pip_size × stop_loss_pips × R_ratio) for 1.0/1.5/2.0 R:R ratios

### UI Components
- Single-page React app (`App.tsx`) with form-based input
- Mobile-optimized responsive design using Tailwind CSS
- Real-time URL state synchronization
- Built-in example data setters for quick testing

## Technical Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest 3
- **Linting**: ESLint 9 with TypeScript support

## Development Notes
- Account currency is fixed to JPY
- Supports major FX pairs including JPY crosses and EUR/USD/GBP crosses
- Precision handling: Uses integer step arithmetic to avoid floating-point rounding errors
- All monetary calculations are in JPY base currency
- Currency pair detection: JPY pairs use 0.01 pip size, others use 0.0001