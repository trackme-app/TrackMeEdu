#!/bin/bash

# Configuration
CERT_DIR="./certs"
CA_KEY="$CERT_DIR/ca.key"
CA_CRT="$CERT_DIR/ca.crt"
DAYS=3650

mkdir -p "$CERT_DIR"

# Generate CA
if [ ! -f "$CA_KEY" ]; then
    echo "Generating CA..."
    openssl genrsa -out "$CA_KEY" 4096
    openssl req -x509 -new -nodes -key "$CA_KEY" -sha256 -days "$DAYS" -out "$CA_CRT" -subj "/CN=TME-Internal-CA"
fi

generate_cert() {
    local name=$1
    local common_name=$2
    local key="$CERT_DIR/$name.key"
    local csr="$CERT_DIR/$name.csr"
    local crt="$CERT_DIR/$name.crt"
    local ext="$CERT_DIR/$name.ext"

    echo "Generating certificate for $name ($common_name)..."

    # Generate private key
    openssl genrsa -out "$key" 2048

    # Generate CSR
    openssl req -new -key "$key" -out "$csr" -subj "/CN=$common_name"

    # Create extension file for SAN
    cat > "$ext" <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = $common_name
DNS.2 = localhost
EOF

    # Sign certificate
    openssl x509 -req -in "$csr" -CA "$CA_CRT" -CAkey "$CA_KEY" -CAcreateserial \
        -out "$crt" -days "$DAYS" -sha256 -extfile "$ext"

    # Cleanup
    rm "$csr" "$ext"
}

# Generate certs for each service
generate_cert "api-gateway" "api-gateway"
generate_cert "worker-tenancy" "worker-tenancy"
generate_cert "worker-iam" "worker-iam"
generate_cert "worker-courseandcurriculum" "worker-courseandcurriculum"
generate_cert "zzdummyservice" "zzdummyservice"

# Set permissions
chmod 644 "$CERT_DIR"/*.crt
chmod 600 "$CERT_DIR"/*.key

echo "Certificates generated in $CERT_DIR"
