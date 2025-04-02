#!/bin/sh
BASE="./scripts/kantata"
OUTPUT_DIR="./lib/translators/kantata"
CONFIG_FILE="$BASE/start.yml"
TEMP_API_FILE="$OUTPUT_DIR/api.yml"

# Disable Redocly telemetry and bundle the OpenAPI spec
REDOCLY_TELEMETRY=off redocly bundle main --config="$CONFIG_FILE" -o "$TEMP_API_FILE"

# Generate TypeScript definitions
openapi-typescript "$TEMP_API_FILE" -o "$OUTPUT_DIR/types.gen.ts"

# Clean up temporary file
rm "$TEMP_API_FILE"