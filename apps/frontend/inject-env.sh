#!/bin/sh
# Replace placeholders in index.html with environment variables

TARGET_FILE="/usr/share/nginx/html/index.html"

# List of variables to replace
VARS="VITE_BACKGROUND_COLOUR_LIGHTMODE VITE_FOREGROUND_COLOUR_LIGHTMODE VITE_ALT_COLOUR_LIGHTMODE VITE_BORDER_COLOUR_LIGHTMODE VITE_BACKGROUND_COLOUR_DARKMODE VITE_FOREGROUND_COLOUR_DARKMODE VITE_ALT_COLOUR_DARKMODE VITE_BORDER_COLOUR_DARKMODE VITE_NAV_COLOUR_LIGHTMODE VITE_NAV_COLOUR_DARKMODE VITE_BUTTON_COLOUR_POSITIVE_LIGHTMODE VITE_BUTTON_COLOUR_POSITIVE_DARKMODE VITE_BUTTON_COLOUR_NEGATIVE_LIGHTMODE VITE_BUTTON_COLOUR_NEGATIVE_DARKMODE"

for VAR_NAME in $VARS; do
    VALUE=$(printenv "$VAR_NAME")
    if [ -n "$VALUE" ]; then
        # Use sed to replace %VAR_NAME% with VALUE
        # We use | as delimiter to avoid issues with / in colors/urls
        sed -i "s|%$VAR_NAME%|$VALUE|g" "$TARGET_FILE"
    fi
done

echo "Environment variables injected into index.html"
