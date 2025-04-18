import prisma from "@/lib/prisma";
import { fetchGitHubContributions } from "@/lib/github";
import { Account } from "@prisma/client";
import { logger } from "@/lib/logger";

const SYNC_INTERVAL_MINUTES = 60;

export class ContributionSync {
  private running = false;
  private intervalId?: NodeJS.Timeout;

  async start() {
    if (this.running) {
      logger.warn("Sync process is already running.");
      return;
    }

    this.running = true;
    logger.info("Starting contribution sync service...");
    await this.syncAllUsers();
    this.scheduleSync();
  }

  stop() {
    if (!this.running) {
      logger.warn("Sync process is not running.");
      return;
    }

    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      logger.info("Stopped contribution sync service.");
    }
  }

  private scheduleSync() {
    this.intervalId = setInterval(async () => {
      if (!this.running) return;
      logger.info("Running scheduled contribution sync...");
      await this.syncAllUsers();
    }, SYNC_INTERVAL_MINUTES * 60 * 1000);
  }

  private async syncAllUsers() {
    try {
      logger.info("Fetching all users for contribution sync...");
      const users = await prisma.user.findMany({
        include: { accounts: true },
      });

      for (const user of users) {
        await this.syncUser(user.id, user.accounts);
      }

      logger.info("Successfully completed syncing all users.");
    } catch (error) {
      logger.error("Failed to sync all users:", error);
    }
  }

  public async syncUser(userId: string, accounts: Account[]) {
    try {
      const githubAccount = accounts.find((a) => a.provider === "github");
      if (githubAccount?.access_token) {
        logger.info(`Syncing GitHub contributions for user ${userId}...`);
        await fetchGitHubContributions(githubAccount.access_token, userId);
        logger.info(
          `Successfully synced GitHub contributions for user ${userId}.`
        );
      } else {
        logger.warn(`No GitHub account linked for user ${userId}.`);
      }
    } catch (error) {
      logger.error(`Failed to sync contributions for user ${userId}:`, error);
    }
  }
}

export const syncService = new ContributionSync();
