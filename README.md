
# Drivers Log

A comprehensive web app designed for driving instructors to manage lessons, track student progress, and oversee vehicle maintenance. It offers detailed daily, weekly, monthly, and yearly reports. Instructors can individually monitor each student's lessons and conveniently download reports in Word format.

## Tech Stack

* NextJS
* TailwindCSS
* Prisma
* Clerk Authentication

## Development Setup

### Prerequisites

- Node.js: [Download and Install Node.js](https://nodejs.org/)

### Installation

1. Clone this repository:

```bash
git clone git@github.com:hassanuahmad/drivers-log.git
```

2. Install project dependencies:

```bash
npm install
```

3. Copy the `.env.example` file and rename it to `.env`. Update the variables with appropriate values:

```env
DATABASE_URL='your-db-url'
SHADOW_DATABASE_URL="your-shadow-db-url"

# The following variables are required for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="clerk-publishable-key"
CLERK_SECRET_KEY="clerk-secret-key"

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/instructor/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/instructor/dashboard

# the following are variables for special instructor features
NEXT_PUBLIC_INSTRUCTOR_CLERK_ID='clerk-user-id'
NEXT_PUBLIC_INSTRUCTOR_NAME='instructor-id'
NEXT_PUBLIC_INSTRUCTOR_LICENCE='instructor-licence-number'
NEXT_PUBLIC_INSTRUCTOR_LICENCE_EXPIRY='instructor-licence-expiry'
NEXT_PUBLIC_ONTARIO_LICENCE=''instructor-ontario-licence-number''

NEXT_PUBLIC_GOOGLE_PLACES_API='your-google-places-api-key'
NEXT_PUBLIC_GOOGLE_CLIENT_ID='your-google-client-id'
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET='your-google-client-secret'
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=''
```

4. Run the migrations using Prisma:

```bash
npx prisma migrate dev
```

### Development

Start the Next.js development server:

```bash
npm run dev
```

Your development environment is now set up and running. Access the site at [http://localhost:3000](http://localhost:3000).
