# Discord Moderation Bot

This project is a Discord moderation bot that utilizes OpenAI's moderation capabilities to monitor and manage messages in Discord servers. The bot automatically removes inappropriate messages and notifies users about the moderation actions taken. Additionally, it provides a slash command for manual moderation by users with a specific role.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Monitors messages in specified channels for inappropriate content.
- Automatically deletes messages that violate moderation policies.
- Sends direct messages to users whose messages have been removed, explaining the reason.
- Logs moderation actions in a designated log channel.
- Provides a slash command for manual moderation by users with a specific role.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/arsh-deeps/DiscordModeration.git
   ```

2. Navigate to the project directory:

   ```
   cd DiscordModeration
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   TOKEN=your_discord_bot_token OPENAI_API_KEY=your_openai_api_key MOD_LOG_CHANNEL=your_mod_log_channel_id MODERATED_CHANNELS=comma_separated_channel_ids MODERATOR_ROLE_ID=your_moderator_role_id CLIENT_ID=your_discord_client_id GUILD_ID=your_discord_guild_id
   ```

## Usage

To start the bot, run the following command:

```
npm start
```

The bot will log in to Discord and begin monitoring messages in the specified channels.

## Manual Moderation

Users with the specified moderator role can use the /moderate slash command to manually moderate a message by its ID. Optionally, a reason for moderation can be provided.

Example usage of the slash command:

```
/moderate message_id:123456789012345678 reason:Inappropriate content
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
