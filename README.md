# Discord Moderation Bot

This project is a Discord moderation bot that utilizes OpenAI's moderation capabilities to monitor and manage messages in Discord servers. The bot automatically removes inappropriate messages and notifies users about the moderation actions taken.

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
   TOKEN=your_discord_bot_token
   OPENAI_API_KEY=your_openai_api_key
   MOD_LOG_CHANNEL=your_mod_log_channel_id
   MODERATED_CHANNELS=comma_separated_channel_ids
   ```

## Usage

To start the bot, run the following command:

```
npm start
```

The bot will log in to Discord and begin monitoring messages in the specified channels.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
