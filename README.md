<h1 align="center">Welcome to Luzu24's Pokétwo Autocatcher</h1>

## Disclamer
**What you are about to use is strictly again Discord's and Pokétwo's ToS**. With that being said, I do not take any resposability.<br>You are doing this at your own risk.

## Instructions
<ul>
  <li>The first thing you need is your Discord Account Token (do not share it for any reason). Instructions on how to get it are in the <a href="https://github.com/Luzu24/PoketwoAutocatcher/blob/main/token.js">token.js</a> file.</l1>
  <li>Download <a href="https://git-scm.com/downloads">Git</a> and <a href="https://nodejs.org/en/download">Node.js</a>.<br><i>You may not use Git and not clone this repository by just downloading LICENSE, index.js, .env and config.json files. You'd still need the folder, tho.</i></li>
  <li>Create a Folder on your PC and copy it's directory.</li>
  <ul>
    <li>Open Windows CMD (Win + R) and run "cd [folder_directory]".</li>
    <li>Run:</li>
    <ul>
      <li>` git clone https://github.com/Luzu24/PoketwoAutocatcher.git `.</li>
      <li>` npm init -y `</li>
      <li>` npm install `</li>
      <li>` npm install discord.js-selfbot-v13 `</li>
    </ul>
  </ul>
  <li>Now that you have the files you need you have to do your configurations. Paste your Token in the .env file (<i>TOKEN="Your Token goes here"</i>).<br>Open the config.json and put the IDs of the <i>ALLOWED_CHANNELS</i> and the ID of the <i>SPAM_CHANNEL</i>.<br><i>You may also edit spam message min/max interval and catch min/max delay, but I would leave it as how you found it if I was you.</i></li>
  <li>Last but not least: run the script. In the CMD you've opened before, run `node index.js`. (<i>Please keep in mind that you have to stop it and run it again if you were to change any values in the code or other associated files.</i>)</li>
</ul>

## Notice
You need to have Pokéname (you can invite it from <a href="https://discord.com/oauth2/authorize?client_id=874910942490677270&permissions=412317379648&scope=applications.commands%20bot">here</a>) in your Discord server.<br>Personal reccomendation: do not use this on your main account, create an ALT instead. Do not trade Pokémons/Pokécoins directly to your main account, use a "bridge" account instead.<br><br>You will have to do the CD command again everytime you close the CMD and then start the selfbot again with `node index.js`.
