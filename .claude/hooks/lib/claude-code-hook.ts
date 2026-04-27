import path from "node:path";
import { argv, stdout } from "node:process";

export type ClaudeCodeHookHandler<EventName extends keyof HookData> = (
  input: HookData[EventName]["input"],
) => Promise<HookData[EventName]["output"]> | HookData[EventName]["output"];

type PermissionMode =
  | "acceptEdits"
  | "auto"
  | "bypassPermissions"
  | "default"
  | "dontAsk"
  | "plan";

type HookInputBase = {
  /** Current session identifier */
  readonly session_id: string;

  /** Path to conversation JSON */
  readonly transcript_path: string;

  /** Current working directory when the hook is invoked */
  readonly cwd: string;

  readonly agent_id?: string;
  readonly agent_type?: string;
};

type HookOutputBase = {
  /** If false, Claude stops processing entirely after the hook runs. Takes precedence over any event-specific decision fields */
  readonly continue?: boolean;

  /** Message shown to the user when continue is false. Not shown to Claude */
  readonly stopReason?: string;

  /** If true, omits stdout from the debug log */
  readonly suppressOutput?: boolean;

  /** Warning message shown to the user */
  readonly systemMessage?: string;
};

type HookData = {
  readonly PostToolUse: {
    readonly input: HookInputBase & {
      readonly hook_event_name: "PostToolUse";

      readonly permission_mode: PermissionMode;

      readonly tool_name: string;
      readonly tool_input?: {
        readonly file_path?: string;
        readonly [key: string]: unknown;
      };
      readonly tool_response?: {
        readonly filePath?: string;
        readonly [key: string]: unknown;
      };
    };

    readonly output: HookOutputBase & {
      readonly decision?: "block";
      readonly reason?: string;
      readonly hookSpecificOutput?: {
        readonly additionalContext?: string;
        readonly updatedMCPToolOutput?: unknown;
      };
    };
  };

  readonly Stop: {
    readonly input: HookInputBase & {
      readonly hook_event_name: "Stop";

      readonly permission_mode: PermissionMode;

      /** `true` when Claude Code is already continuing as a result of a stop hook. Check this value or process the transcript to prevent Claude Code from running indefinitely */
      readonly stop_hook_active: boolean;

      /** contains the text content of Claude’s final response, so hooks can access it without parsing the transcript file */
      readonly last_assistant_message: string;
    };

    readonly output: HookOutputBase & {
      readonly decision?: "block";
      readonly reason?: string;
    };
  };
};

/**
 * @see https://code.claude.com/docs/en/hooks
 */
export async function handleClaudeCodeHook<EventName extends keyof HookData>(
  handler: ClaudeCodeHookHandler<EventName>,
): Promise<void> {
  try {
    const input = await readStdinJson();
    const output = await handler(
      // We don't validate the input shape, we assume it's fine. Validating here
      // would add to the run time and might not be worthwhile if we assume
      // claude is a good boy!
      input as HookData[EventName]["input"],
    );
    stdout.write(JSON.stringify(output));
  } catch (error) {
    stdout.write(
      JSON.stringify({
        systemMessage: `${path.basename(argv[1] ?? "claude-code-hook")}: internal error. ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
      }),
    );
  }
}

async function readStdinJson(): Promise<object> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  const input = JSON.parse(raw);

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`Hook stdin was not a JSON object: ${raw.slice(0, 200)}`);
  }

  return input;
}
