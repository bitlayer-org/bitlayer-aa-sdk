# Bitlayer AA Demo with Particle Connectkit

This example demonstrates how to use Bitlayer AA SDK with Particle Connectkit.

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Prepare the environment

Copy the `.env.example` file to `.env` and fill in the required environment variables.

```bash
cp .env.example .env
```

Fill all the empty values in the `.env` file. You can find the particle project
information in the [Particle Dashboard](https://dashboard.particle.network).

### Run the app

```bash
pnpm run dev
```

This will start a development server at [http://localhost:5173](http://localhost:5173).

To run this app in the root directory, you can use the following command:

```bash
pnpm run dev --filter=example-with-particle
```
