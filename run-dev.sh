#!/bin/bash

# run-dev.sh - Local Development Management Script

function show_help() {
    echo "Usage: ./run-dev.sh [flag]"
    echo ""
    echo "Flags:"
    echo "  -init          Initialize certificates and environment file (.env)"
    echo "  -start         Start the development stack (docker compose up --build)"
    echo "  -stop          Stop the development stack (docker compose down)"
    echo "  -stop-clean    Stop the stack and remove images, volumes, and temp/certs dirs"
    echo "  -clean         Same as -stop-clean"
    echo ""
}

if [[ $# -eq 0 ]]; then
    show_help
    exit 1
fi

case "$1" in
    -init)
        echo "Initializing development environment..."
        
        # 1) Run generate-certs.sh
        if [[ -f "./infra/scripts/generate-certs.sh" ]]; then
            chmod +x ./infra/scripts/generate-certs.sh
            ./infra/scripts/generate-certs.sh
        else
            echo "Error: ./infra/scripts/generate-certs.sh not found."
            exit 1
        fi

        # 2) Duplicate .env.example and prompt for inputs
        if [[ ! -f ".env.example" ]]; then
            echo "Error: .env.example not found."
            exit 1
        fi

        echo "Setting up .env file..."
        cp .env.example .env

        # Read keys from .env.example (excluding comments and empty lines)
        keys=$(grep -v '^#' .env.example | grep -v '^$' | cut -d'=' -f1)

        for key in $keys; do
            # Special case for secrets
            if [[ "$key" == "JWT_SECRET" || "$key" == "REDIS_PASSWORD" ]]; then
                secret=$(openssl rand -hex 24)
                # Escape for sed
                secret_escaped=$(echo "$secret" | sed 's/[&/\]/\\&/g')
                sed -i "s|^$key=.*|$key=$secret_escaped|" .env
                echo "Generated random secret for $key."
                continue
            fi

            # Get current value from .env
            current_value=$(grep "^$key=" .env | cut -d'=' -f2-)
            
            read -p "Enter value for $key [$current_value]: " input
            if [[ -n "$input" ]]; then
                # Escape for sed
                input_escaped=$(echo "$input" | sed 's/[&/\]/\\&/g')
                sed -i "s|^$key=.*|$key=$input_escaped|" .env
            fi
        done

        echo ".env initialization complete."
        ;;

    -start)
        echo "Starting development stack..."
        docker compose up --build
        ;;

    -stop)
        echo "Stopping development stack..."
        docker compose down
        ;;

    -stop-clean|-clean)
        echo "Performing deep clean..."
        docker compose down --rmi all -v
        echo "Deleting ./temp directory..."
        rm -rf ./temp
        echo "Deleting ./certs directory..."
        rm -rf ./certs
        echo "Clean complete."
        ;;

    *)
        show_help
        exit 1
        ;;
esac
