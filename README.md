# Claim Name 🎉

This Web3 application enables communities to grant ENS subdomains to members they follow, streamlining identity and membership management

## How It Works 🛠️

1. **Getting an ENS Domain** 🌐
   - Visit [ens.domains](https://ens.domains/) and connect your Web3 wallet
   - Search for an available .eth domain name
   - Register the domain
2. **Community Setup** 👥
   - The community owner connects their wallet containing an ENS domain
   - They set up text records for avatar and heading to customize community appearance:
     - `avatar=https://example.com/community-avatar.png`
     - `header=https://example.com/community-banner.gif`
3. **Member Management** 👤
   - Community owners use EFP (Ethereum Follow Protocol) to follow members
   - EFP following status determines subname claim eligibility
   - When `NEXT_PUBLIC_MEMBERS_ONLY` is set to true, only followed members can claim subdomains
4. **Claiming Process** 🏷️
   - Members connect their Web3 wallet
   - If `NEXT_PUBLIC_MEMBERS_ONLY` is enabled, only members who hold an EFP follow token from the community can choose their desired subname
   - The system checks availability and validates the chosen name
   - Upon confirmation, the subname is minted to the member's address

## Quick Start 🚀

### Prerequisites 📋

- Node.js (LTS version)
- npm
- WalletConnect Project ID (get it from [Reown Cloud](https://cloud.reown.com/))
- Justaname API Key (get it from [Justaname Dashboard](https://dashboard.justaname.id/auth))

### Setup ⚙️

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```
   # Required
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=   # From WalletConnect Cloud
   NEXT_PUBLIC_ENS_API_KEY=                 # From JustAName Dashboard
   NEXT_PUBLIC_ENS_DOMAIN=                  # Your ENS domain (e.g., billme.eth)
   NEXT_PUBLIC_APP_NAME=                    # Your app name (e.g., "Claim Subname")

   # URLs (defaults to localhost in development)
   NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
   NEXT_PUBLIC_APP_ORIGIN=http://localhost:3000

   # Optional Settings
   NEXT_PUBLIC_MEMBERS_ONLY=true             # If true, only EFP-followed members can claim subnames
   NEXT_PUBLIC_MAINNET_RPC_URL=             # Custom Mainnet RPC URL (optional)
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000/) to see the application.

## Docker Deployment 🐳

### Prerequisites

- Docker
- Docker Compose

### Using Docker Compose

1. Make sure you have a `.env` file with all required variables:

   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration values
   ```

2. Build and start the container:

   ```bash
   docker-compose up -d --build
   ```

   This builds the Docker image and starts the container in detached mode.

3. Access the application at [http://localhost:3000](http://localhost:3000/)

### Manual Docker Build

If you prefer to build and run the Docker image manually:

1. Build the Docker image:

   ```bash
   docker build -t claim-name \
     --build-arg NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id \
     --build-arg NEXT_PUBLIC_APP_NAME=your_app_name \
     --build-arg NEXT_PUBLIC_ENS_DOMAIN=your_domain.eth \
     --build-arg NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000 \
     --build-arg NEXT_PUBLIC_APP_ORIGIN=http://localhost:3000 \
     --build-arg NEXT_PUBLIC_ENS_API_KEY=your_api_key \
     --build-arg NEXT_PUBLIC_MEMBERS_ONLY=true \
     .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 claim-name
   ```

### Production Deployment

For production deployment, update the environment variables with your production URLs:

```bash
docker-compose -f docker-compose.yml up -d --build
```

## Acknowledgments 🙏

- [ENS Domains](https://ens.domains/)
- [Ethereum Follow Protocol](https://efp.app/)
- [Justaname](https://justaname.id/)
