import { Octokit } from "octokit";
import prisma from "./prisma";

type GitHubEvent = {
  id: string;
  type: string | null;
  created_at: string | null;
  repo: {
    name: string;
  };
  payload: {
    commits?: Array<{ message: string }>;
    pull_request?: { title: string };
    issue?: { title: string };
    action?: string;
  };
};

export async function fetchGitHubContributions(
  accessToken: string,
  userId: string
) {
  const octokit = new Octokit({ auth: accessToken });

  try {
    // Fetch authenticated user's login
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;

    // Fetch public events for the user
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });

    // Filter events to only include the types we want
    const filteredEvents = events.filter(
      (event: GitHubEvent) =>
        event.type !== null &&
        ["PushEvent", "PullRequestEvent", "IssuesEvent"].includes(event.type)
    );

    // Map the filtered events to our contribution format
    const contributions = filteredEvents.map((event: GitHubEvent) => {
      let type: "COMMIT" | "PULL_REQUEST" | "ISSUE" = "COMMIT";
      let details: { message?: string; count?: number; title?: string; action?: string } = {};

      if (event.type === "PushEvent") {
        type = "COMMIT";
        details = {
          message: event.payload.commits?.[0]?.message || "No commit message",
          count: event.payload.commits?.length || 0,
        };
      } else if (event.type === "PullRequestEvent") {
        type = "PULL_REQUEST";
        details = {
          title: event.payload.pull_request?.title || "No PR title",
          action: event.payload.action,
        };
      } else if (event.type === "IssuesEvent") {
        type = "ISSUE";
        details = {
          title: event.payload.issue?.title || "No issue title",
          action: event.payload.action,
        };
      }

      return {
        userId,
        platform: "GITHUB" as Platform, // Ensure platform matches the expected type
        repoName: event.repo.name,
        type,
        contributionDate: event.created_at ? new Date(event.created_at) : new Date(),
        details,
      };
    });

    // Save contributions to the database
    if (contributions.length > 0) {
      await prisma.contribution.createMany({
        data: contributions,
        skipDuplicates: true, // Avoid duplicate entries
      });
    }

    return { success: true, count: contributions.length };
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw new Error("Failed to fetch GitHub contributions");
  }
}