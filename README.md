# TimeTracksRecords

TimeTracksRecords is a mobile-first web application designed for racing enthusiasts to track and manage their lap times across various circuits. Built with Next.js, TypeScript, and Tailwind CSS, it offers a premium, dark-mode-first experience.

## Features

-   **My Times (Mis Tiempos)**: View your lap times categorized by "Qualifying" and "Race". Times are grouped by circuit and sorted by best performance.
-   **Load Time (Cargar Tiempo)**: A streamlined wizard to record new lap times:
    1.  **Select Circuit**: Visual list of circuits with immersive imagery.
    2.  **Select Session**: Choose between Qualifying or Race (displays your current Personal Best).
    3.  **Enter Time**: Custom "flip-style" number picker for precise time entry (Minutes:Seconds.Milliseconds).
-   **Dark/Light Mode**: Fully supported themes with a persistent toggle.
-   **Mobile First**: Optimized for touch interactions and mobile viewports.
-   **Local Storage**: All data is persisted locally on your device.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4
-   **State Management**: Zustand (with persist middleware)
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **UI Components**: Custom components built with Radix UI primitives (shadcn/ui inspired).

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).
Simply import the repository into Vercel and deploy.

## Configuration

Access the settings menu via the gear icon in the top right corner to toggle between Dark and Light themes.
