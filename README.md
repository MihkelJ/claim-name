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
   - Only followed members can claim subdomains
4. **Claiming Process** 🏷️
   - Members connect their Web3 wallet
   - Members who hold an EFP follow token from the community can choose their desired subname
   - The system checks availability and validates the chosen name
   - Upon confirmation, the subname is minted to the member's address

## Quick Start 🚀

### Prerequisites 📋

- Node.js (LTS version)
- npm
- WalletConnect Project ID (get it from [WalletConnect Cloud](https://cloud.walletconnect.org/app))
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
   NEXT_PUBLIC_MAINNET_RPC_URL=             # Custom Mainnet RPC URL (optional)
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000/) to see the application.

## Acknowledgments 🙏

- [ENS Domains](https://ens.domains/)
- [Ethereum Follow Protocol](https://efp.app/)
- [Justaname](https://justaname.id/)
