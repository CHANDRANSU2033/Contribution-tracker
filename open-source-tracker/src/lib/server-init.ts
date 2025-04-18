import { syncService } from "@/services/sync";

export function initializeServices() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing background services...");
  }

  try {
    syncService.start();
    console.log("Background services started successfully.");
  } catch (error) {
    console.error("Failed to start background services:", error);
  }

  // Gracefully stop services on termination signals
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Stopping background services...");
    syncService.stop();
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received. Stopping background services...");
    syncService.stop();
  });
}
