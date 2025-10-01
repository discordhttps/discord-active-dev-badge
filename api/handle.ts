import Client, {
  MessageFlags,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.https";
import VercelAdapter from "@discordhttps/vercel-adapter";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const adapter = new VercelAdapter();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // getting publickey from params ?publicKey=key
  // where,
  // name = publicKey
  // publicKey = key
  const [name, publicKey] = ((req.url ?? " ").split("?")[1] ?? " ").split("=");

  // If someone try to vist, the page and doen't have public key
  if (name !== "publicKey" || !publicKey || !publicKey.length) {
    res.writeHead(200, {
      "content-type": "text/plain",
    });
    res.write("Public key is required");
    res.end();
    return;
  }

  const client = new Client({
    publicKey: publicKey,
    token: "",
    httpAdapter: adapter,
  });

  const components = [
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL(
        "https://support-dev.discord.com/hc/article_attachments/10226714575639"
      )
    ),
    new TextDisplayBuilder().setContent(
      "## Am I Eligible for the Active Developer Badge?\n\nThe Active Developer Badge is available to any developer or team that owns at least one active application (app), verified and unverified, alike! For your app to be considered active, it will need to have executed an [application command](https://discord.com/developers/docs/interactions/application-commands) in the last 30 days.\n"
    ),
    new TextDisplayBuilder().setContent(
      "\n**You are now eligible**, as you have just executed a command from your own application. This means the application command has been run within the past 30 days.\n"
    ),
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
      .setDivider(true),
    new TextDisplayBuilder().setContent(
      "## What's next step?\nIf you or your team have an active app, head to the [Developer Portal](https://discord.com/developers/active-developer) to grab your badge! There, you should find a prompt to join the Active Developer Program and claim your badge, by following these steps:"
    ),
    new TextDisplayBuilder().setContent(
      "### Select an Active App\n\nFirst, select an app from the dropdown. Any active app will be eligible, as long as it has received a command within the past 30 days.\n\nIf you have an active app and feel you should be eligible for the Active Developer Badge, please allow at least 24 hours for your app's activity status to be updated.\n\n"
    ),
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Small)
      .setDivider(true),
    new TextDisplayBuilder().setContent(
      "### Designate a Community Server\nNext, designate your official server for your app (for example, your App Support Server, App Community Server or App Development Server).\n\nIn order for a server to appear in the server selection menu, it needs to be set as a Community Server, and you need to have Admin permission in that server.\n\nIf you don't see any servers in the Support Server list, make sure the one you are looking for is set as a Community Server. Here is more information on how to enable the [community feature](https://support.discord.com/hc/en-us/articles/360047132851-Enabling-Your-Community-Server)."
    ),
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Small)
      .setDivider(true),
    new TextDisplayBuilder().setContent(
      "### Choose a Developer News Channel\nFinally, select the channel within the designated server for the Developer News channel to appear in. This will allow for updates about Discord API and Developer News to be sent right to your server's channel.\n\nOnce these steps are complete, you should see your new Active Developer Badge on your Profile! **Congratulations!**\n\n"
    ),
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL(
        "https://support-dev.discord.com/hc/article_attachments/10113142990487"
      )
    ),
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
      .setDivider(true),
    new TextDisplayBuilder().setContent(
      "Powered by **[discord.https](https://github.com/discordhttps/discord.https)**, a robust, modular library for implementing Discord HTTP interactions."
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("github")
        .setEmoji({
          name: "⭐",
        })
        .setURL("https://github.com/discordhttps/discord.https")
    ),
  ];

  client.command(
    (builder) =>
      builder
        .setName("badge")
        .setDescription(
          "Makes you eligible for the Active Developer Badge and provides instructions for your next action."
        ),
    async (interaction) =>
      interaction.reply({
        flags: MessageFlags.IsComponentsV2,
        components,
      })
  );

  // Both get and post will be handled by discord.https
  return await client.listen(req.url ?? "", req, res);
}
