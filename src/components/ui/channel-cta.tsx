import { MessageCircle } from "lucide-react";
import { ButtonLink } from "./button";
import { primaryChannel } from "@/data/channels";
import { channelIcon } from "@/components/layout/channel-icons";

/**
 * "Message me" call to action.
 *
 * Resolves to whichever direct channel is actually configured, and falls back
 * to the on-site brief form when none is — so this button is never a dead
 * link, whatever is or is not set in the environment.
 */
export function ChannelCta({
  message,
  variant = "outline",
  size = "lg",
  className,
}: {
  message?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const channel = primaryChannel(message);

  if (!channel) {
    return (
      <ButtonLink href="/contact" variant={variant} size={size} className={className}>
        <MessageCircle aria-hidden="true" /> Send a project brief
      </ButtonLink>
    );
  }

  const Icon = channelIcon[channel.id as keyof typeof channelIcon];

  return (
    <ButtonLink
      href={channel.href!}
      external
      variant={variant}
      size={size}
      className={className}
      data-channel={channel.id}
    >
      {Icon ? <Icon className="size-5" /> : <MessageCircle aria-hidden="true" />}
      Message on {channel.label}
    </ButtonLink>
  );
}
